import UsersTypes from '../types/User.d';

export const getCircularElement = (array: UsersTypes[], index: number) => {
    if (array.length === 0) {
        throw new Error('配列が空です');
    }
    return array[index % array.length];
};
