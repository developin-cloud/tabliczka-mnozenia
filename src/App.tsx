import { useCallback, useState } from 'react'
import './App.css'
import { Alert, Button, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from '@mui/material'
import { SentimentDissatisfied, SentimentSatisfied } from '@mui/icons-material';

function App() {
  const [mode, setMode] = useState<'select' | 'input' | 'none'>('none');
  const [ceil, setCeil] = useState<{ type: 'part' | 'outcome', value: number }>();
  const [isStarted, setIsStarted] = useState(false);

  const [items, setItems] = useState<{ x: number, y: number, possibleAnswers?: Set<number> }[]>([]);

  const [count, setCount] = useState(0);

  const [error, setError] = useState<string | null>(null);

  const [aswers, setAnswers] = useState<{ x: number, y: number, usersAnswer: number }[]>([]);

  const [isFinished, setIsFinished] = useState(false);

  const start = useCallback(() => {

    let a: { x: number, y: number, possibleAnswers?: Set<number> }[] = [];

    if (ceil?.type === 'outcome') {

      for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 10 / i; j++) {
          if (i * j <= ceil.value) {

            const random = Math.round(Math.random() * 3) + 1;
            const possibleAnswers = new Set<number>([i * j, i * j + random, Math.abs(i * j - random), Math.abs((i + random) * j), Math.abs(i * (j + random))].sort(() => Math.random() - 0.5));

            a.push({ x: i, y: j, possibleAnswers });
          }

        }

      }

      setItems(a.sort(() => Math.random() - 0.5));

      setIsStarted(true);
    }
  }, [mode, ceil]);

  return (
    <>

      <Paper elevation={3} sx={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem', padding: '2rem', maxWidth: 600 }}>
        <Typography variant='h2' sx={{ marginBottom: '2rem' }}>Tabliczka mnożenia</Typography>
        {
          mode === 'none' ? (
            <Grid container spacing={2} justifyContent='center'>
              <Button variant='contained' onClick={() => setMode('select')}>Wybierz wynik z listy</Button>
              <Button variant='contained' onClick={() => setMode('input')}>Wpisz wynik</Button>
            </Grid>
          ) : (<></>)
        }

        {
          mode !== 'none' && !ceil ? (
            <>
              <Typography variant='h5' sx={{ marginBottom: '1rem' }}>
                Maksymalny wynik:
              </Typography>
              {
                Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                  <Button
                    key={value}
                    variant='outlined'
                    sx={{ margin: '0.5rem' }}
                    onClick={() => setCeil({ type: 'outcome', value: value * 10 })}
                  >
                    {value * 10}
                  </Button>
                ))
              }
              <Typography variant='h5' sx={{ marginBottom: '1rem' }}>
                lub
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '1rem' }}>
                Maksymalny czynnik:
              </Typography>
              {
                Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                  <Button
                    key={value}
                    variant='outlined'
                    sx={{ margin: '0.5rem' }}
                    onClick={() => setCeil({ type: 'outcome', value: value * 10 })}
                  >
                    {value}
                  </Button>
                ))
              }
            </>
          ) : (<></>)
        }

        {
          !!ceil && mode !== 'none' && !isStarted && !isFinished ? (
            <Button
              variant='contained'
              sx={{ marginTop: '1rem' }}
              onClick={start}
            >
              Zaczynamy!
            </Button>
          ) : (<></>)
        }

        {
          !!error ? (
            <Alert severity='error' sx={{ marginTop: '1rem' }} onClose={() => setError(null)}>
              {error}
            </Alert>
          ) : (<></>)
        }

        {
          isStarted ? (<>
            <Typography variant='h5'>
              {items[count].x} x {items[count].y} = ?
            </Typography>
            {
              mode === 'select' ? (
                <>
                  {
                    Array.from(items[count].possibleAnswers!).map((answer) => (
                      <Button
                        key={answer}
                        variant='outlined'
                        sx={{ margin: '0.5rem' }}
                        onClick={() => {
                          if (answer === items[count].x * items[count].y) {
                            setError(null);
                            if (count + 1 === items.length) {
                              setIsStarted(false);
                              setIsFinished(true);
                            }
                            setCount(count + 1);
                          } else {
                            setError('Błędna odpowiedź, spróbuj ponownie.');
                          }

                          setAnswers([...aswers, { x: items[count].x, y: items[count].y, usersAnswer: answer }]);
                        }}
                      >
                        {answer}
                      </Button>
                    ))
                  }
                </>
              ) : mode === 'input' ? (
                <>
                  <TextField
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const value = parseInt((e.target as HTMLInputElement).value, 10);
                        if (value === items[count].x * items[count].y) {
                          setError(null);
                          if (count + 1 === items.length) {
                            setIsStarted(false);
                            setIsFinished(true);
                          }
                          setCount(count + 1);
                        } else {
                          setError('Błędna odpowiedź, spróbuj ponownie.');
                        }
                        (e.target as any).value = '';
                        setAnswers([...aswers, { x: items[count].x, y: items[count].y, usersAnswer: value }]);
                      }
                    }}
                  />
                </>
              ) : (<></>)
            }
          </>) : (<></>)
        }

        {
          isFinished ? (<>
            <Button variant='contained' sx={{ marginTop: '1rem' }} onClick={() => {
              setMode('none');
              setCeil(undefined);
              setIsStarted(false);
              setItems([]);
              setCount(0);
              setError(null);
              setAnswers([]);
              setIsFinished(false);
            }}>
              Zacznij od nowa
            </Button>
            <Typography variant='h4' sx={{ marginTop: '1rem' }}>
              Gratulacje! Ukończyłeś ćwiczenie.
            </Typography>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>

              <Typography variant='h6' sx={{ marginTop: '1rem' }}>
                Twoje odpowiedzi:
              </Typography>
              <List>
                {aswers.map((answer) => (
                  <ListItem>
                    <ListItemIcon>
                      {answer.usersAnswer === answer.x * answer.y ? <SentimentSatisfied color="success" /> : <SentimentDissatisfied color="error" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={`${answer.x} x ${answer.y} = ${answer.usersAnswer} ${answer.usersAnswer === answer.x * answer.y ? '' : `(poprawna odpowiedź: ${answer.x * answer.y})`}`}
                    />
                  </ListItem>
                ))}
              </List>
            </div></>
          ) : (<></>)
        }
      </Paper>
    </>
  )
}

export default App
