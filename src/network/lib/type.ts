import { axiosClient } from '../axiosClient';

interface NodeType {
  typeId: Number;
  typeValue: string;
}

export function getTypes(moderator: boolean = false) {
  return axiosClient
    .get(`/${moderator ? 'Moderator' : 'Main'}/Entity/EntityTypes/getTypes`)
    .then(response => response.data as NodeType[]);
}
