import Groq from 'groq-sdk';
import { Task } from '../App';

// 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
// cfb3d0e453aa497ea84ac779f45241fa

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true,
});

export const prioritizeTasks = async (tasks: Task[]): Promise<string[]> => {
  const maxTasks = 5;
  const prompt = `
  You are an intelligent assistant. Prioritize the following tasks based on urgency and importance. Output the task titles in descending order of priority:
  ${tasks
    .slice(0, maxTasks)
    .map(
      (task, index) =>
        `${index + 1}. ${task.title} - Priority: ${task.priority}, Deadline: ${
          task.deadline || 'None'
        }, Status: ${task.status}`,
    )
    .join('\n')}
  `;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    console.log('response', completion.choices[0].message.content);

    const response =
      completion.choices &&
      completion.choices[0] &&
      completion.choices[0].message &&
      completion.choices[0].message.content
        ? completion.choices[0].message.content.trim().split('\n')
        : [];
    return response;
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return [];
  }
};

/*
response:

response Based on the urgency and importance, the task titles in descending order of priority are:

1. DOING HOMEWORK - Priority: Medium, Deadline: None, Status: Active
2. doing excercise - Priority: Medium, Deadline: None, Status: Active

Both tasks have the same priority (Medium) and deadline (None), but since they are both active, I would prioritize them equally.
*/
