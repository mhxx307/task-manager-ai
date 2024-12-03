import { HfInference } from '@huggingface/inference';
import { Task } from '../App';

const hf = new HfInference('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');

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
    const response = await hf.chatCompletion({
      model: 'nvidia/Hymba-1.5B-Instruct',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 512,
      temperature: 0.1,
    });

    const orderedTaskTitles = response.choices.map(
      (choice) => choice.message.content,
    );

    return orderedTaskTitles.filter((title) => title !== undefined) || [];
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return [];
  }
};
