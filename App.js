import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView, TextInput, Alert } from "react-native";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "./components/Categories";
import Todolist from "./components/Todolist";
import { dbService } from "./firebase";
import {
  onSnapshot,
  query,
  collection,
  doc,
  orderBy,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";

export default function App() {
  const [todos, setTodos] = useState([]); // 투두리스트
  const [title, setTitle] = useState(""); // 인풋박스
  const [edit, setEdit] = useState(""); // 수정
  const [category, setCategory] = useState(""); // Study, Watching, Etc

  // 추가
  const newTodo = {
    // id: uuid(),
    title,
    category,
    isDone: false,
    isEdit: false,
    createAt: Date.now(),
  };
  const addTodo = async () => {
    if (title) {
      setTitle("");
      await addDoc(collection(dbService, "todos"), newTodo);
    } else {
      alert("내용을 입력해주세요.");
    }
  };

  // 완료/취소
  const setDone = async (id) => {
    const i = todos.findIndex((todo) => todo.id === id);
    await updateDoc(doc(dbService, "todos", id), {
      isDone: !todos[i].isDone,
    });
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
        onPress: async () => {
          await deleteDoc(doc(dbService, "todos", id));
        },
      },
    ]);
  };

  //  수정
  const setEditing = async (id, title) => {
    setEdit(title);
    const i = todos.findIndex((todo) => todo.id === id);
    await updateDoc(doc(dbService, "todos", id), {
      isEdit: !todos[i].isEdit,
    });
  };
  const editTodo = async (id) => {
    await updateDoc(doc(dbService, "todos", id), {
      title: edit,
      isEdit: false,
    });
  };

  // 카테고리 설정
  const setCate = async (cate) => {
    setCategory(cate);
    // await AsyncStorage.setItem("category", cate);
    await updateDoc(doc(dbService, "category", "currentCategory"), {
      category: cate,
    });
  };

  // 최초 마운팅시 firestore에 저장했던 데이터 불러오기
  useEffect(() => {
    const q = query(
      collection(dbService, "todos"),
      orderBy("createAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const newTodos = snapshot.docs.map((doc) => {
        const newTodo = {
          id: doc.id,
          ...doc.data(),
        };
        return newTodo;
      });
      setTodos(newTodos);
    });

    const getCategory = async () => {
      const snapshot = await getDoc(
        doc(dbService, "category", "currentCategory")
      );
      setCategory(snapshot.data().category);
    };
    getCategory();
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
