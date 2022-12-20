import AsyncStorage from '@react-native-async-storage/async-storage';
import { GROUP_COLLECTION } from '@storage/storageConfig';
import { AppError } from '@utils/AppError';
import { groupsGetAll } from './groupsGetAll';

export async function groupCreate(newGroupName: string): Promise<void> {
  try {
    const storedGroups = await groupsGetAll();

    const groupAlreadyExist = storedGroups.includes(newGroupName);
    if (groupAlreadyExist) {
      throw new AppError('Já existe um grupo com este nome.');
    }

    const storage = JSON.stringify([...storedGroups, newGroupName]);

    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}
