'use client';

import useChatStore from '@/store/useChatStore';
import SubPost from '@/views/home/components/SubPost';
import classNames from 'classnames';

const AppBar = ({ isLab = false }) => {
  const reset = useChatStore((state) => state.reset);
  const isSideMenuOpen = useChatStore((state) => state.isSideMenuOpen);
  const setIsSideMenuOpen = useChatStore((state) => state.setIsSideMenuOpen);

  const toggleSidebar = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const headerClass = classNames({
    active: isSideMenuOpen,
  });

  return (
    <div className="header-container">
      <header className={headerClass}>
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <div className="line_1 line"></div>
          <div className="line_2 line"></div>
          <div className="line_3 line"></div>
        </div>
        <h1>Chat</h1>
        <div className="new-chat" onClick={reset}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEDklEQVR4nO2az2tcVRTHP41VUqQqmLTaanVMFP8FC1lUyEBN6FJQZ4qLJhRctCktVSES2kXTxrjpolCqNjRp3YgrLSHVjW611Y0oLqSioGTTThemsUaOnMDhMvPenXn3vXkvfV84DDPz7vlx3z3nnnPuhRIlSpQoJnqBKjAOHNfPqv6+oVEB5oA7wFoTuqP/y3MbDhPASgvDXZLnDrOBcNbTcJdk3IZ482sJqNAroRKz7H8CZvWz1TN/dzMmbAYGgRGN1Ec1agsdBLbGjJ+LebvP6XMDMc8Jn8zwtBp6FWjEKHYpgk+vx3iLqOcaaW+Rm4BR4Bpwrw3//DSCZ9VjvO8ECA2nZfwwcCNC8G/AEnABOANMK00C2yL4jrfw+Th/Frf4ucnYscB20wdcaSJoFfgceBPYlYD/O014z3iOfb/JWOEXDEP6Zq2A28Bp4MlAMlqtAAl4URhIewXUgLuG8b/Ax0A/4V0rdzHgLTV4nemfGqzSQO52gZpj/HVgB+kiN3nAkLPsvwYeJX1UNJNrZZj4+gctfD5YJtjnBLzrGRm/jsOeOUUrOpRUgU8cn0972eeqGhx2on1aAc93JUS5g7vsD4VIb28Yph/RfYgvX4zoCDX0/2dDCBt1kpzQ+3wS9OrqHNPKcky/By14rpkJkAzvvsIuU9WtBkxvC4Oj5u1LYXPf4aqZAKnqfNAD1E3HJwnVlV/X2lgNMwG+Je3+hAmLSzIJXcGgUUIyQF/UA0+A1B5dwahRQjo5vuhRpacDUK1NF+jX/uI5YAsBGxHnKQbeMzofCLkDzFAMnDI6v52U2aRhdpJi4ITRWfRPhGMFXAGzRucjSZkdLGAMuBCy+TlimEk9QMBEqFWC446VVfhCG7K/Mjq/QkK82GEesD9BgtNs7C9tyP7djItrm8fiAS1/280E6wkSnHqCCag4ZbvonxhLHdYCtQ4THHesRPLnPeUeSKNwmzBMvyDfWDS6it5B8Iw5A1jtUiPUBzuBf1RP6V88FZL5UgE6QrMd7lhe2GeY3wK2ky884TRHZfsOih7gOyNADkDzhHmj27faxQ6OqhEiMWEv+cCIc075cprCFoygv0IHmg7vIC0bnS6nLbDPybS+z/hs0OIx4Aejy03g8SwEv+Tc1/uM7hj/jdFB9NmdlfBHgB8dV8h62ds3L3v+61kJf1jvA9hgmLjt1GbAW3aMl5sqmWCLc0QWNN302OfnnWi/kuWbf0jrAGv8uxmlt7NNToBvZunzD2qgW8uoP1hRt1o0ub2lhayiPVpPuxcgfw105CU0pRcZPwS+BP6I6B1IhreHjPGGZ2MjLbqnhdhIWultHF7rgtENbWZM5CDT/B+vBjriakZTevgyrg3MgVBtrBIlSpQogT/+A2GA4MV3hAAGAAAAAElFTkSuQmCC"
            style={{ width: '30px' }}
            alt=""
          />
        </div>
      </header>
      {/* <SubPost /> */}
    </div>
  );
};

export default AppBar;
