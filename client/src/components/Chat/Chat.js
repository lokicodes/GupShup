import React , {useEffect , useState} from 'react'
import "./Chat.css";
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer';
let socket;
const Chat = ({location}) => {

  const [name , setName] = useState('');
  const [room , setRoom] = useState('');
  const [message , setMessage] = useState('');
  const [messages , setMessages] = useState([]);
  const [users, setUsers] = useState('');
  
  const ENDPOINT = 'https://lets-do-gupshup.herokuapp.com/';

  useEffect(() =>{
    const {name , room} = queryString.parse(location.search);

    socket = io(ENDPOINT, {  
      cors: {
      origin: "http://localhost:5000",
      credentials: true
    },transports : ['websocket'] });
    
    setName(name);
    setRoom(room);

    socket.emit('join' , {name, room} , (error) => {
      if(error){
        alert(error);
      }
    });

    return () => {
      socket.disconnect( );
      socket.off();
    }
  } , [ENDPOINT , location.search]);
  
  useEffect(() => {
    socket.on('message' , (message) => {
      setMessages([...messages , message]);
    });
  } , [messages]);

  const sendMessage = (event) =>{
    event.preventDefault();

    if(message){
      socket.emit('sendMessage' , message , () => setMessage(''));
    }
  }

  useEffect(() => {
    // socket.on('message', message => {
    //   setMessages(messages => [ ...messages, message ]);
    // });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  console.log(message, messages);


  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room = {room}/>
        <Messages messages = {messages} name = {name} />
        <Input message = {message} setMessage = {setMessage} sendMessage = {sendMessage} />
      </div>
      <div className='textContainer'>
        <TextContainer users = {users} />
      </div> 
    </div>
  )
}

export default Chat;