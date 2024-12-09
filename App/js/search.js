// search.js: Provides a basic search across scenes

import { currentProject } from './data.js';

export function searchScenes(query) {
  if(!currentProject || !query.trim()) return [];
  const results = [];
  currentProject.chapters.forEach(ch => {
    ch.scenes.forEach(s => {
      if(s.content.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          chapterId: ch.chapterId,
          chapterTitle: ch.title,
          sceneId: s.sceneId,
          content: s.content
        });
      }
    });
  });
  return results;
}