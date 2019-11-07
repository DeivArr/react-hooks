import React, { useMemo, useState, useEffect, useReducer, useRef } from 'react';
import axios from 'axios';
import List from './List';

const Todo = props => {
  const [inputIsValid, setInputIsValid] = useState(false);
  //const [todoName, setTodoName] = useState('');
  //const [submittedTodo, setSubmittedTodo] = useState(null);
  //const [todoList, setTodoList] = useState([]);
  const todoInputRef = useRef();

  const todoListReducer = (state, action) =>{
    switch(action.type){
      case 'ADD': 
        return state.concat(action.payload);
      case 'SET':
        return action.payload;
      case 'REMOVE':
        return state.filter((todo) => todo.id !== action.payload);
      default: 
        return state;
    }
  }

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios.get('https://counter-project-7b6d0.firebaseio.com/todos.json').then(result => {
      const todos = [];
      const todoData = result.data;
      for(const key in todoData)
      {
        todos.push({id: key, name: todoData[key].name})
      }
      dispatch({type: 'SET', payload: todos})
    });
  }, []);

  // useEffect(() => {
  //   if(submittedTodo)
  //   {
  //     dispatch( {type: 'ADD', payload: submittedTodo} );
  //   }
  // }, [submittedTodo]);

  // const inputChangeHandler = event => {
  //   setTodoName(event.target.value);
  // };

  const inputValidationHandler = (event) =>{
    if(event.target.value.trim() === '')
      setInputIsValid(false);
    else
      setInputIsValid(true);
  }

  const todoAddHandler = () =>{

      const todoName = todoInputRef.current.value;

      axios
      .post('https://counter-project-7b6d0.firebaseio.com/todos.json', {name: todoName})
      .then(res =>{
        setTimeout(() => {
          const todoItem = {id: res.data.name, name: todoName}
          dispatch({type: 'ADD', payload: todoItem})
        }, 3000);
      })
      .catch(err =>{
        console.log(err);
      });
  }

  const todoRemoveHandler = todoId => {
    axios.delete(`https://counter-project-7b6d0.firebaseio.com/todos/${todoId}.json`)
    .then(res => {
      dispatch({type: 'REMOVE', payload: todoId});
    })
    .catch(err => console.log(err));
  }

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        ref = {todoInputRef}
        onChange = {inputValidationHandler}
        style = {{backgroundColor: inputIsValid ? 'white' : 'red' }}
      />
      <button type="button" onClick = {todoAddHandler}>Add</button>
      { useMemo(
        () => (
        <List sentTodos = {todoList} onClick = {todoRemoveHandler} /> )
      , [todoList]
      )}
    </React.Fragment>
  );
};

export default Todo;