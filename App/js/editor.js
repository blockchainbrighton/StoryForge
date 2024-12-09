// js/editor.js: Scene editing and tagging logic

import { currentProject, saveProjects } from './data.js';

export function saveSceneContent(sceneId) {
  let scene = findScene(sceneId);
  if(scene) {
    const textarea = document.getElementById("sceneEditor");
    scene.content = textarea.value;
    const dateInput = document.getElementById("sceneDateInput");
    if(dateInput.value) {
      scene.date = dateInput.value; // store the date string
    } else {
      scene.date = null;
    }
    saveProjects();
  }
}

export function tagCurrentScene(type) {
  const textarea = document.getElementById("sceneEditor");
  const sceneId = textarea.dataset.sceneId;
  if(!sceneId) return;
  const selection = window.getSelection().toString().trim();
  if(selection) {
    const scene = findScene(sceneId);
    if(scene) {
      const tag = `${type}:${selection}`;
      if(!scene.tags.includes(tag)) {
        scene.tags.push(tag);
        saveProjects();
      }
    }
  }
}

function findScene(sceneId) {
  if(!currentProject) return null;
  for(const ch of currentProject.chapters) {
    for(const s of ch.scenes) {
      if(s.sceneId === sceneId) return s;
    }
  }
  return null;
}