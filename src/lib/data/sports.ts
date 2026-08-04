export type Sport = {
  id: string;
  label: string;
  svg: string;
};

export const SPORTS: Sport[] = [
  {
    id: "soccer",
    label: "Soccer",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4.2l2.9 2.1-1.1 3.4h-3.6l-1.1-3.4L12 6.2z"/>',
  },
  {
    id: "basketball",
    label: "Basketball",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM3 11.3h18v1.4H3v-1.4zm8.3-8.24h1.4v18h-1.4v-18z"/>',
  },
  {
    id: "cricket",
    label: "Cricket",
    svg: '<path fill="currentColor" d="M9.7 21.1L7.6 19l7.9-13c.6-1 1.9-1.3 2.8-.6.9.6 1.2 1.9.5 2.9l-8 12.8-1.1-.02z"/><circle fill="currentColor" cx="5.7" cy="19.4" r="2.1"/>',
  },
  {
    id: "tennis",
    label: "Tennis",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM6.6 4.9c2.9 3.3 2.9 10.9 0 14.2C4.5 17.1 3.2 14.6 3.2 12s1.3-5.1 3.4-7.1zm10.8 0c2.1 2 3.4 4.5 3.4 7.1s-1.3 5.1-3.4 7.1c-2.9-3.3-2.9-10.9 0-14.2z"/>',
  },
  {
    id: "volleyball",
    label: "Volleyball",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM3.4 8.9C4.6 6.4 6.8 4.5 9.6 3.6c-.6 2.9-2.6 5.2-5.3 6.2-.4-.3-.7-.6-.9-.9zm-.7 2.4c3.6-.7 6.6-3 8.2-6.1.4-.05.86-.08 1.3-.08.6 0 1.2.05 1.7.14-1.9 3.5-5.4 5.9-9.4 6.4-.7-.03-1.3-.1-1.8-.36zm.4 2.2c4.7-.4 8.8-3 11.1-7 .5.2 1 .5 1.4.8-2.5 4.4-7 7.3-12.1 7.7-.16-.5-.3-1-.4-1.5zm1.2 3.2c5.1-.6 9.6-3.4 12.3-7.5.3.4.6.9.8 1.4-2.8 4.1-7.3 6.9-12.4 7.5-.3-.4-.5-.9-.7-1.4zm2.2 2.6c4.7-.8 8.8-3.4 11.4-7.1.1.5.2 1 .2 1.5-2.6 3.4-6.4 5.7-10.8 6.4-.3-.2-.6-.5-.8-.8z"/>',
  },
  {
    id: "table-tennis",
    label: "Table Tennis",
    svg: '<path fill="currentColor" d="M9.4 3.6a5.2 5.2 0 107.2 7.5l1.4 1.4-1.2 1.2-1.4-1.4-4 4 1.1 1.1-1.2 1.2-3.4-3.4 1.2-1.2 1.1 1.1 4-4-1.4-1.4a5.2 5.2 0 00-3.4-6.1z"/><circle fill="currentColor" cx="19" cy="5.5" r="1.7"/>',
  },
  {
    id: "baseball",
    label: "Baseball",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 2a10 10 0 100 20 10 10 0 000-20zM7.6 4.3c2.6 4.6 2.6 10.8 0 15.4-.5-.3-1-.6-1.4-1 2.1-4.1 2.1-8.3 0-12.4.4-.4.9-.7 1.4-1zm10 1c2.1 4.1 2.1 8.3 0 12.4-.5-.3-1-.6-1.5-1 1.6-3.5 1.6-6.9 0-10.4.5-.4 1-.7 1.5-1z"/>',
  },
  {
    id: "american-football",
    label: "American Football",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4 12c0-3.3 3.7-7 8-7s8 3.7 8 7-3.7 7-8 7-8-3.7-8-7zm5.2-1.2h1.3v2.4H9.2v-2.4zm4.3 0h1.3v2.4h-1.3v-2.4zm-2.15-1.3h1.3v4.9h-1.3v-4.9z"/>',
  },
  {
    id: "rugby",
    label: "Rugby",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.2c4.7 1 8.5 4.6 8.5 8.8s-3.8 7.8-8.5 8.8C7.3 19.8 3.5 16.2 3.5 12S7.3 4.2 12 3.2zm-2.75 4.55l1-1 9 9-1 1-9-9z"/>',
  },
  {
    id: "golf",
    label: "Golf",
    svg: '<path fill="currentColor" d="M7.3 3v18H5.8V3h1.5zM7.3 3l8 3-8 3V3z"/><circle fill="currentColor" cx="17" cy="19.3" r="1.7"/><path fill="currentColor" d="M4 20.3h16v1.4H4z"/>',
  },
  {
    id: "swimming",
    label: "Swimming",
    svg: '<circle fill="currentColor" cx="16.3" cy="5.4" r="1.8"/><path fill="currentColor" d="M14.3 8l-3.4 1.4 1.2 3 3.6-1.5 1.9 3.9-6.9 2.9-.8-1.6-3 1.2-.6-1.5 4.6-1.9-1.9-3.9L14.3 8z"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M2 17.5c1.3-1.4 2.9-1.4 4.2 0s2.9 1.4 4.2 0 2.9-1.4 4.2 0 2.9 1.4 4.2 0 2.9-1.4 4.2 0"/>',
  },
  {
    id: "running",
    label: "Running",
    svg: '<circle fill="currentColor" cx="14.5" cy="4.3" r="1.9"/><path fill="currentColor" d="M9.8 8.2l3 1.1 1.4 3.9 3.6 1-.5 1.9-4.4-1.2-1-2.7-1.2 1.9 2 2.7-.6 5.4-1.9-.2.5-4.4-2.6-3.5c-.6-.8-.4-1.9.4-2.5l1.3-1.3z"/><path fill="currentColor" d="M6.6 16.3l1.7 1-2.9 3.3-1.7-1z"/>',
  },
  {
    id: "cycling",
    label: "Cycling",
    svg: '<path fill="none" stroke="currentColor" stroke-width="2.1" d="M4.6 17.7a3.1 3.1 0 100-6.2 3.1 3.1 0 000 6.2zm14.8 0a3.1 3.1 0 100-6.2 3.1 3.1 0 000 6.2z"/><path fill="currentColor" d="M9.6 8.3h4v1.6h-2.5l3.6 6-1.3.8-1-1.7-2.9 3-1.2-1.1 3-3.1-2.4-4-2.4 4.2-1.4-.8 2.9-5.1c.3-.5.9-.8 1.6-.8z"/><circle fill="currentColor" cx="14" cy="7.6" r="1.6"/>',
  },
  {
    id: "boxing",
    label: "Boxing",
    svg: '<path fill="currentColor" d="M6.6 21V14a4 4 0 014-4c1.6 0 2.4 1 2.8 2.1a3 3 0 013.3 1.2c.9 1.3.6 2.9-.7 4v2.2A2.5 2.5 0 0113.5 22H7.6A1 1 0 016.6 21z"/><circle fill="currentColor" cx="13.6" cy="9" r="2.3"/>',
  },
  {
    id: "badminton",
    label: "Badminton",
    svg: '<path fill="currentColor" d="M12 3l4.6 9.5H7.4L12 3z"/><path fill="none" stroke="currentColor" stroke-width="1.3" d="M9.3 7.3h5.4M8.4 9.8h7.2"/><circle fill="currentColor" cx="12" cy="15" r="2.4"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M12 17.4v3.4"/>',
  },
  {
    id: "ice-hockey",
    label: "Ice Hockey",
    svg: '<path fill="currentColor" d="M6.2 3.3l1.7-.4 3.4 14.2-3.3 1.2z"/><rect fill="currentColor" x="14.3" y="18.4" width="7" height="2.6" rx="1.1"/>',
  },
  {
    id: "skiing",
    label: "Skiing",
    svg: '<circle fill="currentColor" cx="14.7" cy="4.6" r="1.8"/><path fill="currentColor" d="M11 8.6l3.2.5 1 3 3 1.6-.8 1.8-3.7-2-1.3-2.6-1.4 1.7 1.6 2.5-1.5 5.2-1.8-.5 1.2-4.3-2-3.1c-.5-.8-.3-1.9.5-2.5z"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M3.5 20.3l5-1M16 19l4.6 1.3"/>',
  },
  {
    id: "surfing",
    label: "Surfing",
    svg: '<path fill="currentColor" d="M6.8 18.7C10 12 15 8 20.8 6.2c.4 6.3-2.6 12-8.1 15.4-2.2 1.3-4.5.5-5.9-2.9z"/><path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M2 20c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0"/>',
  },
  {
    id: "martial-arts",
    label: "Martial Arts",
    svg: '<circle fill="currentColor" cx="12" cy="4.6" r="1.9"/><path fill="currentColor" d="M12 7v5.2L8.3 16l1.3 1.4L12 15v6h1.6v-6l2.4 2.4L17.3 16 13.6 12.2V7z"/><rect fill="currentColor" x="7.3" y="13.6" width="9.4" height="1.7" rx="0.5"/>',
  },
  {
    id: "weightlifting",
    label: "Weightlifting",
    svg: '<circle fill="currentColor" cx="12" cy="4.4" r="1.8"/><path fill="currentColor" d="M8.2 8.3l1.5-1 2.3 3.6 2.3-3.6 1.5 1-2.7 4.2v7.6h-1.6v-4.6h-1.6V22H8.3v-9.5z"/><rect fill="currentColor" x="4.5" y="6.6" width="2.4" height="2.4" rx="0.4"/><rect fill="currentColor" x="17.1" y="6.6" width="2.4" height="2.4" rx="0.4"/>',
  },
  {
    id: "gym",
    label: "Gym",
    svg: '<rect fill="currentColor" x="9.3" y="10.9" width="5.4" height="2.2" rx="1"/><rect fill="currentColor" x="2.8" y="8.2" width="3.6" height="7.6" rx="1.8"/><rect fill="currentColor" x="17.6" y="8.2" width="3.6" height="7.6" rx="1.8"/>',
  },
  {
    id: "yoga",
    label: "Yoga",
    svg: '<circle fill="currentColor" cx="12" cy="4.6" r="1.9"/><path fill="currentColor" d="M12 7v6.4c1.6 1 3 2.6 3.5 4.6h-2c-.4-1.3-1.3-2.4-2.5-3.1v3.1H9v-3.1c-1.2.7-2.1 1.8-2.5 3.1h-2c.5-2 1.9-3.6 3.5-4.6V7h4z"/>',
  },
  {
    id: "climbing",
    label: "Climbing",
    svg: '<circle fill="currentColor" cx="9" cy="5.2" r="1.8"/><path fill="currentColor" d="M3 20.6L8.6 8.3l3.6 5.7 2.4-4.1 5.4 10.7-1.6.8-4-8-2.5 4.4 3.4 3.1-1.2 1.3-3.8-3.5-2 4.2z"/>',
  },
  {
    id: "padel",
    label: "Padel",
    svg: '<path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M9.6 3.4c3.4-.5 6.4 1.1 7.7 3.9 1.6 3.4-.2 7.5-4 9.2a7 7 0 01-3 .6l-2-.02-1.7-1.7c-.4-.4-.4-1 0-1.4l.15-.13-1-4.9c-.3-1.5.1-3 1.1-4.2A6 6 0 019.6 3.4zm-.2 2c-.8.15-1.5.55-2 1.2-.6.75-.85 1.7-.65 2.65l.9 4.4 4.5-4c1.3-1.2 1.5-3.2.4-4.5a3 3 0 00-3.15-.75z"/><path fill="currentColor" d="M5.2 15.5l1.5 1.5-3.3 3.3-1.5-1.5z"/><circle fill="currentColor" cx="18.5" cy="18" r="1.8"/>',
  },
];

export function sportById(id: string): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
