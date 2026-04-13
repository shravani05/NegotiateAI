import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  scenario: null,
  style: null,
  strategy: '',
  transcript: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SCENARIO': return { ...state, scenario: action.payload };
    case 'SET_STYLE': return { ...state, style: action.payload };
    case 'SET_STRATEGY': return { ...state, strategy: action.payload };
    case 'APPEND_TURN': return { ...state, transcript: [...state.transcript, action.payload] };
    case 'SET_TRANSCRIPT': return { ...state, transcript: action.payload };
    case 'RESET': return { ...initialState };
    default: return state;
  }
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setScenario = (data) => dispatch({ type: 'SET_SCENARIO', payload: data });
  const setStyle = (style) => dispatch({ type: 'SET_STYLE', payload: style });
  const setStrategy = (text) => dispatch({ type: 'SET_STRATEGY', payload: text });
  const appendTurn = (turn) => dispatch({ type: 'APPEND_TURN', payload: turn });
  const setTranscript = (t) => dispatch({ type: 'SET_TRANSCRIPT', payload: t });
  const reset = () => dispatch({ type: 'RESET' });

  return (
    <SessionContext.Provider value={{ ...state, setScenario, setStyle, setStrategy, appendTurn, setTranscript, reset }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
