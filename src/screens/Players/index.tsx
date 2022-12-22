import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, TextInput } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ButtonIcon } from '@components/ButtonIcon';
import { Filter } from '@components/Filter';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { AppError } from '@utils/AppError';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';

type RouteParams = {
  group: string;
};

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const newPlayerNameInputRef = useRef<TextInput>(null)

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (newPlayerName.trim()) {
      const newPlayer: PlayerStorageDTO = {
        name: newPlayerName,
        team
      };

      try {
        await playerAddByGroup(newPlayer, group);
        await fetchPlayersByTeam();

        newPlayerNameInputRef.current?.blur();

        setNewPlayerName('');
      } catch (error) {
        if (error instanceof AppError) {
          Alert.alert('Nova pessoa', error.message);
        } else {
          console.log(error);
          Alert.alert('Nova pessoa', 'Não foi possível adicionar.');
        }
      }
    } else {
      Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.');
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await playersGetByGroupAndTeam(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.');
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group);
      await fetchPlayersByTeam();
    } catch (error) {
      console.error(error);
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.')
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]);

  return (
    <Container>
      <Header showBackButton />

      <Highlight
        title={group}
        subtitle="Adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />

        <NumberOfPlayers>
          {players.length}
        </NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            name={item.name}
            onRemove={() => handlePlayerRemove(item.name)}
          />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Não há pessoas nesse time" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          [
            {
              paddingBottom: 100
            },
            !players.length && {
              flex: 1,
            }
          ]
        }
      />

      <Button
        title="Remover turma"
        type="SECONDARY"
      />
    </Container>
  );
}
