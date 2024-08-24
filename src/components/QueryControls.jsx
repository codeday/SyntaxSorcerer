export default function QueryControls() {
    return (
        <div className="submit-buttons">
            <button id="send-button" onClick={ sendMessage }>Enter</button>
            <button id="query-button" onClick={ sendCodebaseQuery }>Query codebase</button>
        </div>
    );
}