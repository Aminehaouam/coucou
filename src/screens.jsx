import AirportScene from './components/scene/AirportScene';
import LondonScene from './components/scene/LondonScene';
import CafeScene from './components/scene/CafeScene';
import HotelScene from './components/scene/HotelScene';
import LandmarkScene from './components/scene/LandmarkScene';
import HighStreetScene from './components/scene/HighStreetScene';

/**
 * One entry per screen. Only the scenery, copy and Coco's pose differ;
 * the lesson layout is shared.
 */
export const SCREENS = [
  {
    id: 'airport',
    Scene: AirportScene,
    cocoPose: { intro: 'curious', choice: 'perched' },
    label: 'Arriving in England',
    heading: 'Welcome to England',
    text: 'Answer a few questions about your visit.',
    phrase: 'What is the purpose of your visit?',
    button: 'Continue',
    choice: {
      label: 'At the border',
      heading: 'What is the purpose of your visit?',
      options: [
        { text: 'I’m here on holiday for a week.', good: true },
        { text: 'Yes, passport.', good: false },
        { text: 'I go hotel, many days.', good: false },
      ],
    },
  },
  {
    id: 'taxi',
    Scene: LondonScene,
    cocoPose: { intro: 'perched', choice: 'curious' },
    label: 'Exploring London',
    heading: 'Where would you like to go?',
    text: 'Ask the driver to take you to your hotel.',
    phrase: 'Could you take me to this address, please?',
    button: 'Let\'s go',
    choice: {
      label: 'In the taxi',
      heading: 'How will you greet the driver?',
      options: [
        { text: 'Good morning! Lovely day, isn’t it?', good: true },
        { text: 'Hello. Hotel. Now.', good: false },
        { text: 'Hey you, start driving.', good: false },
      ],
    },
  },
  {
    id: 'cafe',
    Scene: CafeScene,
    cocoPose: { intro: 'perched', choice: 'proud' },
    label: 'Eating out',
    heading: 'What would you like to order?',
    text: 'Choose something from the menu.',
    phrase: 'Could I have a cup of tea, please?',
    button: 'Place order',
    choice: {
      label: 'At the table',
      heading: 'How will you order your tea?',
      options: [
        { text: 'Could I have a cup of tea, please?', good: true },
        { text: 'Give me tea.', good: false },
        { text: 'Tea. Quickly.', good: false },
      ],
    },
  },
  {
    id: 'hotel',
    Scene: HotelScene,
    cocoPose: { intro: 'perched', choice: 'curious' },
    label: 'Your stay',
    heading: 'Checking in',
    text: 'Confirm your reservation at reception.',
    phrase: 'I have a reservation under my name.',
    button: 'Check in',
    choice: {
      label: 'At reception',
      heading: 'How will you check in?',
      options: [
        { text: 'Hello, I have a reservation under Smith.', good: true },
        { text: 'I want the key now.', good: false },
        { text: 'Room. Where?', good: false },
      ],
    },
  },
  {
    id: 'landmark',
    Scene: LandmarkScene,
    cocoPose: { intro: 'proud', choice: 'curious' },
    label: 'Discover England',
    heading: 'Let’s explore',
    text: 'Ask for information about a historic attraction.',
    phrase: 'Could you tell me where to buy a ticket?',
    button: 'Explore',
    choice: {
      label: 'At the museum',
      heading: 'How will you ask about tickets?',
      options: [
        { text: 'Excuse me, where can I buy a ticket?', good: true },
        { text: 'Ticket where?', good: false },
        { text: 'You. Tickets. Now.', good: false },
      ],
    },
  },
  {
    id: 'street',
    Scene: HighStreetScene,
    cocoPose: { intro: 'curious', choice: 'curious' },
    label: 'Out and about',
    heading: 'Can you help me?',
    text: 'Ask a local for directions.',
    phrase: 'Excuse me, how do I get to the nearest station?',
    button: 'Ask for directions',
    choice: {
      label: 'On the street',
      heading: 'How will you stop someone?',
      options: [
        { text: 'Excuse me, could you help me, please?', good: true },
        { text: 'Hey, you. Station.', good: false },
        { text: 'Where is? Quick!', good: false },
      ],
    },
  },
];
