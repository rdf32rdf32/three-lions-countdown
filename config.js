window.SITE_CONFIG = {
  version: '1.5.0',
  match: {
    competition: 'World Cup quarter-final',
    home: 'England',
    away: 'Norway',
    dateISO: '2026-07-11T23:00:00+02:00',
    venue: 'Miami',
    stage: 'Quarter-final',
    lineupStatus: 'predicted',
    lineupUpdated: 'Predicted line-up. Check official channels close to kick-off.',
    finalStatus: '',
    route: [
      { label: 'Group Stage', detail: 'Completed', status: 'done' },
      { label: 'Round of 32', detail: 'England 2-1 DR Congo', status: 'done' },
      { label: 'Round of 16', detail: 'England 3-2 Mexico', status: 'done' },
      { label: 'Quarter-final', detail: 'England v Norway', meta: 'Miami | 11 July', status: 'live' },
      { label: 'Semi-final', detail: 'Winner advances', meta: 'Atlanta Stadium | 15 July', status: 'future' },
      { label: 'Final', detail: 'World Cup Final', meta: 'New York New Jersey Stadium / MetLife Stadium | 19 July', status: 'future' }
    ],
    highlights: {
      title: 'England v Mexico 3-2',
      subtitle: 'Highlights from 6 July 2026.',
      youtubeEmbed: 'https://www.youtube.com/embed/dg4-V0LTaN0?si=3pcZ11-_SsA5wwm7'
    },
    teamNews: [
      { status: 'green', icon: '🟢', title: 'Kane fit and available', text: 'England captain expected to lead the line.' },
      { status: 'green', icon: '🟢', title: 'Bellingham expected to start', text: 'Midfield energy and control remain central to the plan.' },
      { status: 'amber', icon: '🟡', title: 'Saka fitness being monitored', text: 'Final call closer to kick-off.' },
      { status: 'red', icon: '🔴', title: 'Guehi suspended', text: 'Defensive reshuffle likely for Norway.' }
    ],
    weather: { latitude: 25.958, longitude: -80.239, label: 'Miami' },
    nextFixtures: [
      { opponent:'Argentina or Switzerland', date:'15 July 2026', venue:'Atlanta Stadium', competition:'World Cup semi-final', conditional:true },
      { opponent:'Final opponent TBC', date:'19 July 2026', venue:'New York New Jersey Stadium', competition:'World Cup final', conditional:true }
    ],
    bbcHeadlines: [
      { title:'Latest England team news, reports and reaction', url:'https://www.bbc.com/sport/football/teams/england' },
      { title:'World Cup fixtures, results and coverage', url:'https://www.bbc.com/sport/football/world-cup' },
      { title:'BBC football live coverage', url:'https://www.bbc.com/sport/football' }
    ],
    links: {
      bbc: 'https://www.bbc.com/sport/football/teams/england',
      flashscore: 'https://www.flashscore.com/football/',
      fifa: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026'
    }
  }
};
