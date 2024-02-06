import { Profile } from '@/types/daouOffice';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  profile: Profile;
  daouOfficeCookie: string;
};

type Actions = {
  reset: () => void;
  setDaouOfficeCookie: (daouOfficeCookie: string) => void;
  setProfile: (profile: Profile) => void;
};

const initialState: State = {
  daouOfficeCookie: '',
  profile: {
    basic_info: {
      company_id: 0,
      company_name: '',
      email: '',
      id: 0,
      name: '',
    },
    contact_info: {
      direct_tel: '',
      fax: '',
      mobile_no: '',
    },
    position_info: {
      department: '',
      grade: '',
      position: '',
    },
    summaries: {
      approval: 0,
      approval2: 0,
      asset: 0,
      board: 0,
      calendar: 0,
      community: 0,
      mail: 0,
      report: 0,
      survey: 0,
    },
  },
};

const useDaouOfficeStore = create(
  devtools(
    immer<State & Actions>((set, get) => ({
      ...initialState,
      reset: () => set(initialState),
      setDaouOfficeCookie(daouOfficeCookie) {
        set({ daouOfficeCookie });
      },
      setProfile(profile) {
        set({ profile });
      },
    })),
  ),
);

export default useDaouOfficeStore;
