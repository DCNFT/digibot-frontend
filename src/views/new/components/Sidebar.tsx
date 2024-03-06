import useChatStore from '@/store/useChatStore';
import classNames from 'classnames';

const Sidebar = () => {
  const isSideMenuOpen = useChatStore((state) => state.isSideMenuOpen);
  const sidebarClass = classNames({
    sidebar: true,
    active: isSideMenuOpen,
  });

  return (
    <nav className={sidebarClass} id="sidebar">
      <ul>
        <li>
          <div className="nav-item new-chat">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAENUlEQVR4nO2ay29NQRjApy3SRjwS71c9ivgXSCxINNGKpQStWLQisdAKoZJKw8LbxkIiKNFiI1Yl0rJh67kRYiEaEtINtVBVPxl3TjJ3eu655zHn3Hvq/JKTm5t75nvcmfnmm29GiIyMjIwUAlQD9cAe4LD6lN+rxUQGWA7cAH7gzg/1+3Ix0QDagRH8Id9rExMF4CLhuCgmSM9HoS3tc37Ew7m3wHn1WYifJYsJwCRgJdCoIvVBFbXlsxeYVqS9DGherFDv1RV570aSTi9Rjj4AhosYdrPIUufZ3njfi+FYl0igAtgCDABj+Oeuh0y5rmPpD5Bsisv5TcBLD8WDQD9wBTgDnFJPJzDXQ66cMiZvi81nOS2Ady5tW207Phu47aJoFOgDdgO1EeR3uMg+67PtOZe2HWFtGQewXvWsznfgNLBAWMBjBNQVaVcX6wgAmoBfmuA/QDcwx4qC/KnlifF+/DEA2Kccdvgig1VkwWlYBcj1vO78C2BhVEdTkQeQm/P6sH8CzLDlaJFMUGZyhZBz/UKBOW8nEyQX7QeNno/deU1/G9HYH9WAO8acj3XYl9VukPxI/CeugBdgJHhNB52fNnq+wsjwrlnzJlpMuO5RERpWvy+zoWyLkeRYXectLJFydLaqnWWr+m5vw0NuY+NwWvxPALXarm7UVnqbGsjt5x36xP8GuWKGw26fbSqBZq3iE+WRcirj97RwGUvPwX1taYFd2KVZlAJyNTyHwQDtZK/ZpCleT/0tf/0B2lWqDdMpC09TkCkgl2hZXwQuATV+2/kpRFwWKQA4ptncYnMFOCtSAHBSs/lIVGGdmrATIgUAxzWbO6MKO5TCESBPhxwORBW2N4UxQJbc7RQ/yR1jOQwEaOcnEXJNcFzaylG4OoDux5rNDUH8HQewJmQesCtsglOg7fsAuj9p7TzL5n6EVantb9BMsDlsglOg7fsANQIHaXdVGL/zUEdZYfYCTWESHJe2ciVa5VNvi/WNG/mXEu6LMgZ4qNnabkvoUu0MYLQUhVA/AIuA38pOWb9YbFN4f7lXhIz1f8C28K2a8G/APFFGAPON4mijbQWVwHNNQbcoI4AezbZnsoodh5J6TYmMCZtFGaCSNf2ccmOcyno1RV+tBprwd5CGNJtuxa1wtpFpvUrybNCwZSbwWrPlIzArCcVrjft692JX6u78U80Gac+6pJRPB97oUyERxfnDXu95uebvSEr5VHUfQA+G0cpOwQPekOH8vqSU1xhHZPbSTX/rfI8R7UeS7Pkpch9gOH80ofT2vMsJ8Mck5/xkGegMA2KrD6otbYva2Di5vU5vItFeqweYFyA/WDrykk+Xush4FXgEfKYwMsPbIJIE2ElpGVMbscZY0lsff8D2Ejg9rK7Xtpc60/wHsM3SEZfb06UOX+QJVIO64xe9jJWRkZGRIQLxF5upWvThhc8YAAAAAElFTkSuQmCC"
              style={{ width: 30 }}
            />
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg> */}
            <span>New Chat</span>
          </div>
        </li>
        <li>
          <div className="nav-item">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFT0lEQVR4nOWbTW9WRRTHp0h9obpBwQUJUA0IBFTwAxhETUzUXQFlZRSpL3WBQoFYEmOQWo2JARpDokvjwrTU4hsWgVCB6gcQjS74DCxoKe3PnPRcc5jc22f63LkvhX9yE3qZmf+ZuTNnzvnPPM5FALAI2ARsB7qAbn269N1G4B53KwF4COgBRoHrNIaUOQ+8D7S7+QrgaeA0ME3zkLojwBY3XwCsA85kdGgKuAwMAEeAXn3k34P6f1kDJoO51tUVQIuuZ3+ay99DwDbggYB2lqg/GAYmvbYmgD3C5eoE4F412O/4UWB5jnZXAP0pgyoD2ubqAOB+YMwzUBzeuogc64ELHsdFYHEsjjxf/pLntA4DCwvgWgj0pQxCW5VrftgYcwPYWQLvLuVKcKISn8CMw7NffmeJ3K97M+G9srjtVmcd02FXMoBPvN1hTZnkZzyHF33NB9jQqj4gwUhZxM8YUtmnHy2FOHt3sDNxcxmkpw3h0cIJG9vzhbHnVBmJzbSSXc8T5ES0aaWJGMW2lUWS9ZjRHnI1AXDS2HWgSKJRQ7TN1QTAy8auc0WRLDIOZyowsekL1ACyIHU/DuBZapbmRCGiCjNKToI/A+tcJT+uBnL9Zeo8nrvDKQTbDcFgYJ1e/SLNYiI0yNIMMcHW3B1OIegyBEdczaCpd4K3iyDYbwg+cjWD2GTs22/e3yU7g2qMy2+XAThg3u82729oBvvcrb4E3jHvX8vwLz8Bq5p1gicC66xWDa/be+Td6oA6meUaOMEOT7fo0ATOF1zHNbhbEEKw0VS8HGjUv2Tjn8A6qeVS6ominOCJWQa33xNUBN9KnBMSCE1oBRnJJXUZAFWSp81XvTvgY/oa4x/Ag42IzpsK2wMMW6VTrNd7erLWn1cns9wsofBoo/JaZwHwqTcIv886E5jZShIMu5oA+M7YtW+OdV/1zh8GM30C0G6mmlRa4eqRDif5htj2cBNt+DtFz2yFR0zBflcx1Kkl+DFHOyLnJ7iWufSALaagjPx6VxGADd70fSpHW+ITfjNt/RIqi12oUBS9FFMO0wG16fuzWQXXelleX17ynLL4tViyOPB5kOrFTJRmsSuGAYFGdhZ1MCJOVAUfNGBK1xg1xLTbjxTujGVIoAiabFstlWiMQJt3OIFOzcJ8AvCIF9P/GlsC8wKrnxsVXpwyCPL3hphGeZx7Pb4fgDsjtr/MtC2yXmujCm16SmsxqYcWhej0wEGPbyDmzJMcxLS9KaSC+IR3UzTASV1TMq2WxjJQOQ95XF8Dd0Rq2x79Pz+Ximu8aNFC1u7fmrsf04SnO+dzxeP4MoZTBL4ybb7STAObJZrKeU2uWbwYYQDsbZQ9ebctESXP5ZTIyx6AVJE1F0SokEMLvTL3lk7h3shPx7yQ2esOL8jb6m43qLNO8FhRJHJo8UadTpoFog3ORWNsGp7ElttxxQKww9h1tkiiDwzRSVcTAN83qzE2c93ORozLXMVQ3TPJNqcK1z25OZE6VihZmD3HgzPBGABeMIQToUdhRUC8vac1PFkGaYt32/xihRrjWGlX7lKOquzI97qSAXxm+MdLn4nAh9yMzhK53/S4d5fF/T8kj5dp5+0K7SV1PhFBE2Glkuv393k7wnTMX51krHk77ZMzjtmPyYuAHr2f9YzZW7C3H0vpfPk/wWEmH5DrKhYHCwxyjqf8Gm2gqi/fmiKmHiogsdmh4a3f8XG9RNVSldP7xjPoSgSNsFf1xiFNabMkuVNVBl3Oy7jKwpR2vPgIrxGAl0rq9Lg62H11uNDhLERqKkATlGUgeqO0LfpjFDHjP5aJobl5Q5veAAAAAElFTkSuQmCC"
              style={{ width: 30 }}
            />
            <span>최근 대화 기록</span>
          </div>
          <ul>
            <li>
              네비바 토글 &amp; 채팅 아이콘...
              <button>
                <img src="/images/minus.png" alt="" />
              </button>
            </li>
            <li>
              아이콘 제작 도구 추천...
              <button>
                <img src="/images/minus.png" alt="" />
              </button>
            </li>
          </ul>
        </li>
        <li>
          <div className="nav-item log-out">
            <img src="images/profile.jpg" alt="" className="nav-profile" />

            <span>XD</span>
            <button
              id="logoutBtn"
              className="logoutBtn"
              style={{ display: 'none' }}
            >
              Log Out
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
