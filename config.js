window.SITE_CONFIG = {
  version: '1.7.0',
  match: {
    competition: 'FIFA World Cup 2026 semi-final',
    home: 'England',
    away: 'Argentina',
    dateISO: '2026-07-15T20:00:00+01:00',
    venue: 'Atlanta Stadium',
    stage: 'Semi-final',
    lineupStatus: 'predicted',
    lineupUpdated: 'Predicted line-up. Confirmed teams normally arrive around one hour before kick-off.',
    finalStatus: '',
    route: [
      { label: 'Round of 32', detail: 'England 2–1 DR Congo', status: 'done' },
      { label: 'Round of 16', detail: 'England 3–2 Mexico', status: 'done' },
      { label: 'Quarter-final', detail: 'England 2–1 Norway (aet)', meta: 'Miami | 11 July', status: 'done' },
      { label: 'Semi-final', detail: 'England v Argentina', meta: 'Atlanta | 15 July | 20:00 UK', status: 'live' },
      { label: 'Final', detail: 'France or Spain', meta: 'New York/New Jersey | 19 July', status: 'future' }
    ],
    highlights: {
      title: 'Norway 1–2 England (after extra time)',
      subtitle: 'Quarter-final result from 11 July 2026.',
      youtubeEmbed: ''
    },
    teamNews: [
      { status: 'red', icon: '🔴', title: 'Jarell Quansah suspended', text: 'His two-match ban following the red card against Mexico also covers the Argentina semi-final.' },
      { status: 'amber', icon: '🟡', title: 'Jordan Henderson unavailable', text: 'The midfielder missed the Norway quarter-final with a fractured wrist.' },
      { status: 'green', icon: '🟢', title: 'Marc Guéhi available', text: 'Guéhi was not suspended and featured against Norway.' },
      { status: 'green', icon: '🟢', title: 'Bellingham in decisive form', text: 'He scored both goals in the 2–1 extra-time quarter-final win.' }
    ],
    weather: { latitude: 33.7554, longitude: -84.4008, label: 'Atlanta' },
    nextFixtures: [
      { opponent:'Argentina', date:'15 July 2026 · 20:00 UK', venue:'Atlanta Stadium', competition:'World Cup semi-final', conditional:false },
      { opponent:'France or Spain', date:'19 July 2026 · 20:00 UK', venue:'New York/New Jersey Stadium', competition:'World Cup final', conditional:true }
    ],
    links: {
      england: 'https://www.englandfootball.com/england/mens-senior-team',
      flashscore: 'https://www.flashscore.com/football/',
      fifa: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026'
    }
  }
};
