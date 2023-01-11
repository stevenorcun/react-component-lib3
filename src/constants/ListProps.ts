export interface ListProps {
  id: string;
  createdAt: number;
  updatedAt: number;
  value: {
    label: string;
    favorite: boolean;
    case: string;
    status: boolean;
    listsId: string[];
  };
}
