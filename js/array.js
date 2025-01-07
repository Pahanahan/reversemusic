let array = [
  {
    number: 1,
    done: false,
    active: true,
    music: "audio/002/Миллион алых роз.mp3",
    musicReversed: [
      "audio/002/Запись.mp3",
      "audio/002/Запись2.mp3",
      "audio/002/Запись3.mp3",
      "audio/002/Запись4.mp3",
    ],
    timeRecord: "9 секунд",
    timeMusic: 12,
    times: [3.2, 2.4, 3.0, 1.9],
    answer: [
      "Миллион алых роз",
      // Полные строки
      "миллион миллион миллион алых роз из окна из окна из окна видишь ты",

      // Короткие варианты
      "миллион алых роз",
      "миллион миллион",
      "из окна видишь ты",
      "миллион роз из окна",
      "алых роз видишь ты",

      // Отдельные части
      "алых роз",
      "из окна",
      "видишь ты",
      "роз из окна",

      // Вариации с перестановкой
      "миллион роз алых из окна видишь ты",
      "алых роз миллион из окна",
      "из окна алых роз видишь миллион",
      "видишь ты из окна миллион роз алых",

      // Вариации с разными окончаниями
      "миллион алых роз из окна видишь",
      "миллион алых роз из окна",
      "миллион алых роз",
      "миллион миллион алых роз видишь ты",
    ],
  },
  {
    number: 2,
    done: false,
    active: false,
    music: "audio/001/Группа Крови.mp3",
    musicReversed: [
      "audio/001/Запись.mp3",
      "audio/001/Запись2.mp3",
      "audio/001/Запись3.mp3",
      "audio/001/Запись4.mp3",
    ],
    timeRecord: "9 секунд",
    timeMusic: 13,
    times: [2.5, 2.0, 2.4, 2.3],
    answer: [
      "Группа крови",
      // Полные строки
      "группа крови на рукаве мой порядковый номер на рукаве пожелай мне удачи в бою",

      // Короткие варианты
      "группа крови",
      "группа крови на рукаве",
      "мой порядковый номер",
      "мой порядковый номер на рукаве",
      "пожелай мне удачи",
      "пожелай мне удачи в бою",

      // Отдельные части
      "на рукаве",
      "порядковый номер",
      "удачи в бою",

      // Вариации с перестановкой
      "пожелай удачи",
      "группа крови мой порядковый номер",
      "на рукаве пожелай мне удачи",

      // Вариации с разными окончаниями
      "группа крови на рукаве мой порядковый номер",
      "мой порядковый номер на рукаве пожелай мне удачи",
    ],
  },
  {
    number: 3,
    done: false,
    active: false,
    music: "audio/003/Поворот.mp3",
    musicReversed: [
      "audio/003/Запись.mp3",
      "audio/003/Запись2.mp3",
      "audio/003/Запись3.mp3",
    ],
    timeRecord: "12 секунд",
    timeMusic: 13,
    times: [5.2, 3.3, 3.1],
    answer: [
      "Поворот",
      // Полные строки
      "вот новый поворот и мотор ревет что он нам несет",
      "вот новый поворот и мотор ревет",
      "что он нам несет",

      // Короткие варианты
      "новый поворот",
      "мотор ревет",
      "вот новый поворот",
      "что он несет",

      // Отдельные части
      "новый поворот",

      // Вариации с перестановкой
      "мотор ревет новый поворот",
      "вот что он нам несет",
      "что нам несет мотор",

      // Вариации с разными окончаниями
      "вот новый поворот что он нам несет",
      "новый поворот мотор ревет",
      "что он нам несет новый поворот",
    ],
  },
];

export default array;
