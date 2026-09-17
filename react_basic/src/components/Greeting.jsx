// props 이해
// props는 부모 컴포턴트가 자식 컴포너트에게 전달하는 값

// 자식 컴포넌트
export function Greeting({name}) {
    return <p>안녕하세요. {name}님</p>
}

// 부모 컴포넌트
function App() {
    return <Greeting name = "학습자 joy" />
}

export default App;