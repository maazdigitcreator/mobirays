const GlossarySection = ({ letter, terms, extraPadding = false, isNumeric = false }) => {
  const getLetterClass = () => {
    if (isNumeric) return 'text-5xl font-semibold';
    if (extraPadding) return 'py-5';
    if (letter === 'M' || letter === 'P') return 'py-10';
    return '';
  };

  return (
    <div className="flex gap-1 relative">
      <div className="w-[12%] flex-shrink-0 text-black px-2 py-1.5 flex items-center border border-[#0580A5] justify-center">
        <span className={`${isNumeric ? 'text-5xl font-semibold' : 'text-7xl font-bold'} ${!isNumeric ? getLetterClass() : ''}`}>
          {letter}
        </span>
      </div>

      <div className="w-[4%] flex-shrink-0 relative mt-1.5 -mb-1.5">
        <div className="border-none flex h-full">
          <div className="w-full h-full border border-[#0580A5]" style={{ transform: 'skewY(14deg)' }}>
            <div className="p-4 text-white" style={{ transform: 'skewY(14deg)' }}></div>
          </div>
        </div>
      </div>

      <div className=" border border-[#0580A5] px-3 py-2.5 items-center mt-3 h-full w-[84%]">
        <span className="text-black text-xs sm:text-base">
          {terms.map((term, index) => (
            <p key={index}>{term}</p>
          ))}
        </span>
      </div>
    </div>
  );
};

const DictionaryContent = () => {
  const glossaryData = [
    {
      letter: 'A',
      extraPadding: true,
      terms: [
        'A-GPS (Assisted GPS)',
        'A2DP (Advanced Audio Distribution Profile)',
        'AAC (Advanced Audio Coding)',
        'Accelerometer',
        'Airplane mode',
        'Alarm Clock',
        'Alphanumeric',
        'AMOLED display (Active-matrix organic light-emitting diode)',
        'Analog',
        'Android',
        'ANT+',
        'Antenna',
        'Aperture',
        'APN (Access Point Name)',
        'Apple AirPlay',
        'Apple AirPlay 2',
        'Apple iOS',
        'Apple iOS 10',
        'Apple iOS 11',
        'Apple iOS 12',
        'Apple iOS 7',
        'Apple iOS 8',
        'Apple iOS 9',
        'Apple Pay',
        'aptX',
        'Audio jack',
        'Auto-focus',
        'AVRCP (Audio/Video Remote Control Profile)'
      ]
    },
    {
      letter: 'B',
      terms: [
        'Bada OS',
        'Band',
        'Bandwidth',
        'Bar',
        'Base Station',
        'Battery Charging',
        'BeiDou Navigation Satellite System',
        'Benchmarking',
        'Biometrics',
        'Bit',
        'BlackBerry OS',
        'BlackBerry Playbook OS',
        'Bluetooth',
        'bps (Bits per Second)',
        'Brand',
        'Broadband',
        'Browser',
        'Byte'
      ]
    },
    {
      letter: 'C',
      extraPadding: true,
      terms: [
        'Calculator',
        'Calendar',
        'Call alerts',
        'Calling Plan',
        'Camera',
        'Capacitive Touchscreen',
        'Car Kit',
        'Carrier',
        'CDMA (Code-Division Multiple Access)',
        'CDMA2000',
        'Cell',
        'Chipset',
        'cHTML (Compact HyperText Markup Language)',
        'CIF (Common Intermediate Format)',
        'Clamshell',
        'CMOS (Complementary metal-oxide semiconductor)',
        'Color depth',
        'Concatenated SMS',
        'Connected GPS',
        'Construction',
        'Corning Gorilla Glass',
        'CPU (Central Processing Unit)',
        'Crosstalk',
        'CSTN (Color Super Twisted Nematic)',
        'CTIA',
        'Custom ringtones',
        'CyanogenMod'
      ]
    },
    {
      letter: 'D',
      terms: [
        'D-Pad (Direction Pad)',
        'Data Disclaimer',
        'DC-HSDPA (Dual Carrier or Dual Cell High-Speed Downlink Packet Access)',
        'Digital Zoom',
        'Display type',
        'DLNA (Digital Living Network Alliance)',
        'DNSe (Digital Natural Sound engine)',
        'Downlink',
        'DRM (Digital Rights Management)',
        'Dual-band',
        'Dual-Mode',
        'Dual-SIM',
        'DVB-H (Digital Video Broadcasting - Handheld)',
        'Dynamic Memory'
      ]
    },
    {
      letter: 'E',
      terms: [
        'EDGE (Enhanced Data for Global Evolution)',
        'EDR (Enhanced Data Rate)',
        'EGPRS',
        'EGSM (Extended GSM)',
        'Email client',
        'Emoji',
        'EMS (Enhanced Message Service)',
        'eSIM',
        'EU Battery endurance',
        'EU Energy efficiency class',
        'EU Energy label',
        'EU Free fall reliability class',
        'EU Product repairability class',
        'EV-DO',
        'EV-DV',
        'Exchangeable covers',
        'External Antenna Jack',
        'External Display'
      ]
    },
    {
      letter: 'F',
      terms: [
        'FCC (Federal Communications Commission)',
        'Feature Phone',
        'Femtocell',
        'Firefox OS',
        'Firmware',
        'Fixed-focus',
        'Flash Memory',
        'Flight mode',
        'Flip-down phone',
        'FM Radio',
        'FM Transmitter',
        'Form factor',
        'FOTA (Firmware Over-The-Air)',
        'FPS (Frames Per Second)',
        'Frame Error Rate',
        'Frequency',
        'FTP (File Transfer Protocol)'
      ]
    },
    {
      letter: 'G',
      terms: [
        'Galileo (Global Navigation Satellite System)',
        'GB (Gigabyte)',
        'Gbps (Gigabits per second)',
        'Geo-tag',
        'GLONASS (Global Navigation Satellite System)',
        'GNSS Positioning',
        'GPRS',
        'GPS (Global Positioning System)',
        'gpsONE',
        'gpsOneXTRA Assistance technology',
        'GPU (Graphics Processing Unit)'
      ]
    },
    {
      letter: 'H',
      terms: [
        'H.263',
        'H.264',
        'H.265',
        'Half-QWERTY keyboard layout',
        'Handwriting recognition',
        'Haptics',
        'HEVC',
        'Hot Spot',
        'Hot Swap',
        'HSCSD (High-Speed Circuit Switched Data)',
        'HSDPA (High-Speed Downlink Packet Access)',
        'HSDPA+ (High-Speed Downlink Packet Access Plus)',
        'HSP (Headset Profile)',
        'HSUPA (High-Speed Uplink Packet Access)',
        'HTML (Hypertext Markup Language)',
        'Hz (Hertz)'
      ]
    },
    {
      letter: 'I',
      terms: [
        'iDEN (Integrated Digital Enhanced Network)',
        'Image Signal Processor (ISP)',
        'IMAP (Internet Message Access Protocol)',
        'IMEI (International Mobile Equipment Identity)',
        'IP (Internet Protocol)',
        'IP Ratings',
        'IrDA (Infrared Data Association)'
      ]
    },
    {
      letter: 'J',
      terms: ['Java']
    },
    {
      letter: 'K',
      terms: [
        'KB (Kilobyte)',
        'Kbps (Kilobits per second)',
        'Key Guard',
        'Key Lock Switch'
      ]
    },
    {
      letter: 'L',
      terms: [
        'Land line',
        'LCD (Liquid Crystal Display)',
        'LED (Light-Emitting Diode)',
        'Li-Ion (Lithium Ion)',
        'Li-Polymer (Lithium Polymer)',
        'LiMo OS',
        'Linux',
        'Location-Based Services (LBS)',
        'Lock code',
        'Long SMS',
        'Long Term Evolution (LTE)',
        'Loudspeaker'
      ]
    },
    {
      letter: 'M',
      terms: [
        'Macro',
        'Maemo OS',
        'Magnetometer',
        'mAh',
        'Mass Storage mode',
        'MB (Megabyte)',
        'Mbps (Megabit per second)',
        'MeeGo OS',
        'Megapixel',
        'Memory card slot',
        'Memory effect',
        'Messaging',
        'MHz (Megahertz)',
        'Micro USB',
        'microSD',
        'microSDHC',
        'Microsoft Exchange (Server)',
        'MIDI (Musical Instrument Digital Interface)',
        'MIDP (Mobile Information Device Profile)',
        'Mil-Spec (MIL-STD)',
        'MIMO',
        'Mini-USB',
        'miniSD',
        'MMC',
        'MMCmobile',
        'MMS (Multimedia Messaging Service)',
        'Mobile games',
        'Mobile High-Definition Link (MHL)',
        'Mobile IM (Instant Messaging)',
        'Mobile WiMAX',
        'Mobility DisplayPort (MyDP)',
        'Models',
        'Modem',
        'Monochrome',
        'MP3 (MPEG Layer 3)',
        'MPEG (Motion Picture Experts Group)',
        'MPEG-4 video',
        'Multitouch input method',
        'Music playback time (battery life)',
        'Music Player'
      ]
    },
    {
      letter: 'N',
      terms: [
        'NAND Memory',
        'Network capacity',
        'Network coverage',
        'NFC (Near Field Communication)',
        'NiCd (Nickel Cadmium)',
        'NiMH (Nickel Metal Hydride)',
        'NOR Memory',
        'Numeric keypad'
      ]
    },
    {
      letter: 'O',
      terms: [
        'OEM (Original Equipment Manufacturer)',
        'OLED (Organic Light-Emitting Diode)',
        'Optical Zoom',
        'OS (Operating System)',
        'OTA (Over-The-Air)',
        'OTG'
      ]
    },
    {
      letter: 'P',
      terms: [
        'Packet Data',
        'Pager',
        'PC Sync',
        'PCS (Personal Communications Service)',
        'PDA (Personal Digital Assistant)',
        'Percentile rank',
        'Phone Book Access (PBA)',
        'Phone Life Cycle',
        'Phone Physical Attributes',
        'Phonebook',
        'PIM (Personal Information Manager/Management)',
        'PIN code (Personal Identification Number)',
        'Pixel',
        'Pixel density (Pixels Per Inch)',
        'Polyphonic ringtones',
        'POP3 (Post Office Protocol)',
        'Port',
        'Predictive text input',
        'Price',
        'PTT (Push-To-Talk)',
        'PUK Code (PIN UnlocK Code)',
        'Push'
      ]
    },
    {
      letter: 'Q',
      terms: [
        'QCIF (Quarter Common Intermediate Format)',
        'Quad-band',
        'Quasi-Zenith Satellite System (QZSS)',
        'QVGA (Quarter Video Graphics Array)',
        'QWERTY keyboard layout'
      ]
    },
    {
      letter: 'R',
      terms: [
        'RAM (Random-Access Memory)',
        'RBDS (Radio Broadcast Data System)',
        'RDS (Radio Data System)',
        'Rechargeable Battery Types',
        'Resistive touchscreen',
        'Resolution',
        'Ringer ID',
        'Ringing profiles',
        'Ringtone',
        'Roaming',
        'ROM (Read-Only Memory)',
        'RS-MMC (Reduced-Size Multi Media Card)',
        'RSA (Rural Service Area)',
        'RSS (Rich Site Summary)',
        'Ruggedized (Rugged)'
      ]
    },
    {
      letter: 'S',
      terms: [
        'S60 user interface',
        'SAP (SIM Access Profile)',
        'SAR (Specific absorption rate)',
        'Screen protection',
        'SD (Secure Digital)',
        'Secondary camera',
        'Sensors',
        'Side Keys',
        'SIM',
        'SIM lock',
        'Single-Band',
        'Skin',
        'Slimport',
        'Smart Watch',
        'Smartphone',
        'SMIL',
        'SMS (Short Messaging Service)',
        'SNS (Social network service)',
        'Soft keys',
        'Soft Reset',
        'Speed Dial',
        'Stand-by time (battery life)',
        'Stereo Speakers',
        'Streaming Video',
        'Stylus',
        'Sub-QCIF',
        'SVGA',
        'Symbian',
        'SyncML'
      ]
    },
    {
      letter: 'T',
      terms: [
        'Talk time (battery life)',
        'TCP/IP',
        'TD-SCDMA (Time Division-Synchronous Code Division Multiple Access)',
        'TEST',
        'Tethering',
        'Text messaging (texting)',
        'TFD (Thin Film Diode)',
        'TFT (Thin Film Transistor)',
        'Theme',
        'To-Do list',
        'Touchscreen',
        'Trackball',
        'Transflash',
        'Transflective',
        'Tri-band'
      ]
    },
    {
      letter: 'U',
      terms: [
        'UFS',
        'UI (User Interface)',
        'UIQ',
        'UMA',
        'UMTS',
        'Unlocked phone',
        'Upload',
        'UPnP (Universal Plug and Play)',
        'USB (Universal Serial Bus)',
        'USB On-The-Go',
        'USIM'
      ]
    },
    {
      letter: 'V',
      terms: [
        'VGA (Video Graphics Array)',
        'Video call',
        'Video Codec',
        'Voice dialing',
        'Voice mail',
        'Voice memo',
        'VoIP (Voice over Internet Protocol)',
        'VPN (Virtual Private Network)'
      ]
    },
    {
      letter: 'W',
      terms: [
        'WAP (Wireless Application protocol)',
        'watchOS',
        'WCDMA (Wideband Code Division Multiple Access)',
        'Wear OS',
        'Wearable Technology',
        'webOS',
        'Wi-Fi',
        'Windows Mobile',
        'Windows Phone OS',
        'Wireless email',
        'WLAN',
        'WMV (Windows Media Video)'
      ]
    },
    {
      letter: 'X',
      terms: ['Xenon flash']
    },
    {
      letter: '0-9',
      isNumeric: true,
      terms: [
        '2G',
        '3.5mm headphone jack',
        '3G',
        '4G',
        '5G',
        '802.11'
      ]
    }
  ];

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full gap-1">
        {glossaryData.map((section, index) => (
          <GlossarySection
            key={index}
            letter={section.letter}
            terms={section.terms}
            extraPadding={section.extraPadding}
            isNumeric={section.isNumeric}
          />
        ))}
      </div>
    </div>
  );
};

export default DictionaryContent;