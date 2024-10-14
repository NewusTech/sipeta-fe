// Define the shape of the state
type BearState = {
  bears: number;
};

// Define the shape of the actions
type BearActions = {
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
};

// Combine state and actions
export type BearStore = BearState & BearActions;

export interface NotificationsType {
  id: string;
  layananformnum_id: number;
  userinfo: number;
  title: string;
  description: string;
  url: string;
  date: string;
  isopen: number;
}
