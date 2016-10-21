import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


interface IQuestion {
  key: string,
  default: string,
  cb?: (answer: string) => any
}

/**
 * Asks a question similar to `npm init`.
 */
export function askQuestion(question: IQuestion): Promise<any> {

  return new Promise((resolve, reject) => {

    rl.question(`${question.key}: (${question.default}) `, (answer) => {

      try {
        let ans = question.cb ? question.cb(answer) : answer;
        resolve((answer === '') ? question.default : ans);
      }
      catch (e) {
        // If the callback throws an error, ask the question again.
        // Is possible to make an infinite loop.
        console.error(e);
        askQuestion(question);
      }

    });
  });
}

process.on('close', () => rl.close());