import OpenAI from 'openai';
import { Task } from '../App';

const baseURL = 'https://api.aimlapi.com/v1';
const apiKey = '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';
// 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
// cfb3d0e453aa497ea84ac779f45241fa

const api = new OpenAI({
  apiKey,
  baseURL,
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
    const completion = await api.chat.completions.create({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [
        {
          role: 'system',
          content: prompt.substring(0, 256),
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

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
