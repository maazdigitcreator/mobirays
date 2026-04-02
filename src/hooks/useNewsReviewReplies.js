import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/useData";
import { newsDiscussionService } from "../services/newsDiscussionService";
import { formatReviewDate } from "../utils/productReview";

const ITEMS_PER_PAGE = 5;

const getNewsReviewReplyErrorMessage = (error) => {
  const apiError = error?.data || error;
  if (apiError?.errors) {
    const firstError = Object.values(apiError.errors).flat()[0];
    if (firstError) return firstError;
  }

  return apiError?.message || "Failed to load news reviews.";
};

export const useNewsReviewReplies = () => {
  const { allNews } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [replies, setReplies] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
  });
  const [editingReply, setEditingReply] = useState(null);
  const [editStatus, setEditStatus] = useState({ loading: false, error: "" });
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchReplies = async () => {
      setStatus({
        loading: true,
        error: "",
      });

      try {
        const data = await newsDiscussionService.getMemberReviews({
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setReplies(data);
        setStatus({
          loading: false,
          error: "",
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setReplies([]);
        setStatus({
          loading: false,
          error: getNewsReviewReplyErrorMessage(error),
        });
      }
    };

    void fetchReplies();

    return () => {
      controller.abort();
    };
  }, []);

  const newsById = useMemo(
    () => new Map(allNews.map((news) => [news.id, news])),
    [allNews],
  );

  const normalizedReplies = useMemo(
    () =>
      replies.map((reply) => {
        const matchedNews = newsById.get(reply.post_id || reply.news_id);

        return {
          id: reply.id,
          title: reply.title,
          author: reply.user_name,
          date: formatReviewDate(reply.created_at),
          rating: Number.parseInt(reply.rating, 10),
          content: reply.content,
          subjectName: matchedNews?.name || "News Item",
          subjectImage: matchedNews?.image || null,
          subjectSlug: matchedNews?.slug || null,
        };
      }),
    [replies, newsById],
  );

  const filteredReplies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return normalizedReplies;

    return normalizedReplies.filter(
      (reply) =>
        reply.title.toLowerCase().includes(normalizedQuery) ||
        reply.subjectName.toLowerCase().includes(normalizedQuery) ||
        reply.author.toLowerCase().includes(normalizedQuery) ||
        reply.content.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedReplies, searchQuery]);

  const totalPages = Math.ceil(filteredReplies.length / ITEMS_PER_PAGE);
  const resolvedCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;
  const indexOfLastItem = resolvedCurrentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentReplies = filteredReplies.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEditOpen = (reply) => {
    setEditingReply(reply);
    setEditStatus({ loading: false, error: "" });
  };

  const handleEditClose = () => {
    setEditingReply(null);
    setEditStatus({ loading: false, error: "" });
  };

  const handleEditSubmit = async ({ title, content, rating }) => {
    if (!editingReply) return;

    setEditStatus({ loading: true, error: "" });

    try {
      await newsDiscussionService.update(editingReply.id, {
        title,
        content,
        rating,
      });

      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === editingReply.id
            ? {
                ...reply,
                title,
                content,
                rating,
              }
            : reply,
        ),
      );
      setEditingReply(null);
      setEditStatus({ loading: false, error: "" });
    } catch (error) {
      setEditStatus({
        loading: false,
        error: getNewsReviewReplyErrorMessage(error),
      });
    }
  };

  const handleDelete = async (replyId) => {
    setDeletingId(replyId);

    try {
      await newsDiscussionService.delete(replyId);
      setReplies((prev) => prev.filter((reply) => reply.id !== replyId));
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        error: getNewsReviewReplyErrorMessage(error),
      }));
    } finally {
      setDeletingId(null);
    }
  };

  return {
    currentReplies,
    currentPage: resolvedCurrentPage,
    searchQuery,
    status,
    totalPages,
    setCurrentPage,
    handleSearchChange,
    editingReply,
    editStatus,
    handleEditOpen,
    handleEditClose,
    handleEditSubmit,
    deletingId,
    handleDelete,
  };
};
