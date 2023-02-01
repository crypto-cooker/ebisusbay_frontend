import { setUpLeaderboard } from './leaderboardFunctions.js'

const AnnouncementBoard = () => {
  return (
    <section class="gl-legacy container">
        <div class="row">
            <div class="col-12 col-lg-7 text-center text-lg-start">
                <h2 class="chakra-heading mb-0 css-1dklj6k">Leaderboard</h2>
            </div>
            <div >
                <ul id="regionsUL" class="activity-filter">
                </ul>
            </div>
            <div class="mt-4 table-responsive">
            
            </div>
        </div>
        <div class="mt-4 table-responsive">
            <table class="table">
            <thread class="border-bottom">
                <tr>
                    <th scope="col" class="tex-center">Rank</th>
                    <th scope="col" class="tex-center">Faction</th>
                    <th scope="col" class="tex-center">Troops</th>
                </tr>
            </thread>
            <tbody id="troopsTable">
            </tbody>
        </table>
        </div>
        
        {/* <div className='App'>
      <h1>Geeksforgeeks : How to include an external 
      JavaScript library to ReactJS?</h1>
      <ScriptTag isHydrating={true} type="text/javascript" 
      src= "../old/battle-bay/announcementBoard/announcementBoard.html" />
    </div>
  ); */}

    </section>
  )
};


export default AnnouncementBoard;