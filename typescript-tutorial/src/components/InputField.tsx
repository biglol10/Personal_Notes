import { useRef } from 'react';
import './styles.css';
// use rafce
// input__box => bem convention of writing CSS class names

// https://stackoverflow.com/questions/42081549/typescript-react-event-types
interface Props {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  handleAdd: (e: React.FormEvent) => void;
}

// function InputField({ todo, setTodo }: Props) {
const InputField: React.FC<Props> = ({ todo, setTodo, handleAdd }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className='input'
      onSubmit={(e) => {
        handleAdd(e);
        inputRef.current?.blur(); // blur shifts the focus from this input box
      }}
    >
      <input
        type='input'
        placeholder='Enter a task'
        className='input__box'
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        ref={inputRef}
      />
      <button type='submit' className='input_submit'>
        GO
      </button>
    </form>
  );
};

export default InputField;
