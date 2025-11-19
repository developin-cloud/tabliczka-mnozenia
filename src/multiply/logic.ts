export function generateMultiplicationItems(ceil: { type: 'part' | 'outcome', value: number }) {
    const a: { x: number, y: number, possibleAnswers?: Set<number> }[] = [];

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
      
    } else if (ceil?.type === 'part') {
      for (let i = 1; i <= ceil.value; i++) {
        for (let j = 1; j <= 10; j++) {

          const random = Math.round(Math.random() * 3) + 1;
          const possibleAnswers = new Set<number>([i * j, i * j + random, Math.abs(i * j - random), Math.abs((i + random) * j), Math.abs(i * (j + random))].sort(() => Math.random() - 0.5));

          a.push({ x: i, y: j, possibleAnswers });
        }
      } 
    }

    return a.sort(() => Math.random() - 0.5)
}