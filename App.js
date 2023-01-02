import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "./components/Categories";
import Todolist from "./components/Todolist";

export default function App() {
  const [todos, setTodos] = useState([]); // 투두리스트
  const [title, setTitle] = useState(""); // 인풋박스
  const [edit, setEdit] = useState(""); // 수정
  const [category, setCategory] = useState(""); // Study, Watching, Etc

  // 추가
  const newTodo = {
    id: uuid(),
    title,
    category,
    isDone: false,
    isEdit: false,
  };
  const addTodo = () => {
    if (title) {
      setTitle("");
      setTodos([...todos, newTodo]);
    } else {
      alert("내용을 입력해주세요.");
    }
  };

  // 완료/취소
  const setDone = (id) => {
    const newTodos = [...todos];
    const i = todos.findIndex((todo) => todo.id === id);
    newTodos[i].isDone = !newTodos[i].isDone;
    setTodos(newTodos);
  };

  // 삭제
  const delTodo = (id) => {
    Alert.alert("삭제 확인", "정말 삭제하시겠습니까?", [
      {
        text: "취소",
        style: "cancel",
      },
      {
        text: "삭제",
        style: "destructive",
        onPress: () => {
          const newTodos = todos.filter((todo) => todo.id !== id);
          setTodos(newTodos);
        },
      },
    ]);
  };

  //  수정
  // 1. useState로 edit 상태 관리
  // 2. id를 매개변수로 활용
  // 3. 투두리스트 중 id와 일치하는 아이템을 수정
  // 4. setState로 수정값 반환
  const setEditing = (id, title) => {
    setEdit(title);
    const newTodos = [...todos];
    const i = todos.findIndex((todo) => todo.id === id);
    newTodos[i].isEdit = !newTodos[i].isEdit;
    setTodos(newTodos);
  };
  const editTodo = (id) => {
    const newTodos = [...todos];
    const i = todos.findIndex((todo) => todo.id === id);
    newTodos[i].title = edit;
    newTodos[i].isEdit = false;
    setTodos(newTodos);
  };

  // 카테고리 설정
  // 1. useState로 category 상태 관리
  // 2. 카테고리마다 조건문으로 카테고리와 일치하는 투두리스트만 반환
  // 3. 클릭한 카테고리 색상 변경
  const setCate = async (cate) => {
    setCategory(cate);
    await AsyncStorage.setItem("category", cate);
  };

  // async storage
  // 투두리스트의 현재 상태를 AsyncStorage에 저장
  useEffect(() => {
    const saveTodos = async () => {
      await AsyncStorage.setItem("todos", JSON.stringify(todos));
    };
    if (todos.length > 0) saveTodos();
  }, [todos]);

  // 최초 마운팅시 AsyncStorage에 저장했던 데이터 불러오기
  useEffect(() => {
    const getData = async () => {
      const resTodos = await AsyncStorage.getItem("todos");
      const resCate = await AsyncStorage.getItem("category");
      setTodos(JSON.parse(resTodos) ?? []);
      setCategory(resCate ?? "Study");
    };
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>또두리스트</Text>
      <TextInput
        style={styles.input}
        placeholder="내용을 입력해주세요."
        value={title}
        onChangeText={setTitle}
        onSubmitEditing={addTodo}
      />
      <Categories category={category} setCate={setCate} />
      <Todolist
        todos={todos}
        setDone={setDone}
        editTodo={editTodo}
        setEditing={setEditing}
        delTodo={delTodo}
        category={category}
        setEdit={setEdit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  title: {
    flex: 0.08,
    fontSize: 40,
    fontWeight: "bold",
  },
  input: {
    flex: 0.06,
    border: "1px solid #333",
    borderRadius: "5px",
    backgroundColor: "#fff",
    width: "90%",
    marginBottom: 6,
    paddingLeft: 10,
  },
});
