import React, { useState, useEffect } from 'react';
import { Text, FlatList, SafeAreaView } from 'react-native';
import Todo from '../../Todo';

import firestore from '@react-native-firebase/firestore';
import { Appbar, TextInput, Button } from 'react-native-paper';

function Todos() {
    const [ todo, setTodo ] = useState('');
    const [ loading, setLoading ] = useState(true);
    const [ todos, setTodos ] = useState([]);
    const ref = firestore().collection('todos');

    async function addTodo() {
        await ref.add ({
            title: todo,
            complete: false,
        });
        setTodo('');
    }

    useEffect (() => {
        return ref.onSnapshot((querySnapshot) => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { title, complete } = doc.data();
                list.push ({
                    id: doc.id,
                    title,
                    complete,
                });
            });

            setTodos(list);

            if ( loading ) {
                setLoading(false);
            }
        });
    }, []);

    return (
        <>
            <Appbar>
            <Appbar.Content title={'TODOs List'} />
        </Appbar>
        <FlatList
            style={{flex: 1}}
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Todo {...item} />}
        />
        <TextInput label={'Nouvelle Todo'} value={todo} onChangeText={setTodo} />
        <Button onPress={() => addTodo()}>Add TODO</Button>
        
        </>
    );
    }

    export default Todos;