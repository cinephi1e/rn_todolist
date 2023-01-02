import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Todolist = ({
  todos,
  setDone,
  editTodo,
  setEditing,
  delTodo,
  category,
  setEdit,
}) => {
  return (
    <ScrollView style={styles.todolist}>
      {todos.map((todo) => {
        if (category === todo.category) {
          return (
            <View key={todo.id}>
              <View style={styles.todo}>
                <TouchableOpacity onPress={() => setDone(todo.id)}>
                  {todo.isDone ? (
                    <AntDesign name="checksquareo" size={18} color="black" />
                  ) : (
                    <Ionicons
                      name="md-square-outline"
                      size={17.5}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
                {todo.isEdit ? (
                  <TextInput
                    defaultValue={todo.title}
                    onChangeText={setEdit}
                    onSubmitEditing={() => editTodo(todo.id)}
                    style={styles.editInput}
                  />
                ) : (
                  <Text style={styles.todoTitle}>{todo.title}</Text>
                )}
                <View style={styles.todoBtn}>
                  <TouchableOpacity
                    onPress={() => setEditing(todo.id, todo.title)}
                  >
                    {todo.isEdit ? (
                      <TouchableOpacity onPress={() => editTodo(todo.id)}>
                        <Text>done</Text>
                      </TouchableOpacity>
                    ) : (
                      <Text>edit</Text>
                    )}
                  </TouchableOpacity>
                  <Text>&nbsp;&nbsp;</Text>
                  <TouchableOpacity onPress={() => delTodo(todo.id)}>
                    <Text>del</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }
      })}
    </ScrollView>
  );
};

export default Todolist;

const styles = StyleSheet.create({
  todolist: {
    flex: 10,
    width: "90%",
  },
  todo: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "5px",
    padding: 15,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  todoTitle: {
    fontSize: 17,
    marginLeft: 5,
    width: "75%",
  },
  editInput: {
    flex: 1,
    paddingLeft: 5,
    fontSize: 17,
    color: "#888",
  },
  todoBtn: {
    marginLeft: "auto",
    flexDirection: "row",
  },
});
