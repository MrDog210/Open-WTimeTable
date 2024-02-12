import * as SQLite from 'expo-sqlite';
import { CREATE_DATABASE } from '../constants/database';

const database = SQLite.openDatabase('lectures.db')

function handleError(_,error) {
  console.log(error)
}

export function init() {
  database.transaction((tx) => {
    tx.executeSql(CREATE_DATABASE, [], 
      () => {}, // če je sucsses
      handleError)
  })
}