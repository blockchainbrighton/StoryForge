// js/timeline.js: Stub for timeline view (basic placeholder)

import { currentProject, saveProjects } from './data.js';

export function showTimelineView() {
  if(!currentProject) return alert("No project loaded.");

  const main = document.querySelector('.editor-pane');
  main.innerHTML = "<h2>Timeline View</h2><div id='timelineContainer' class='timeline-container'></div>";

  const scenes = getAllScenes().sort((a,b) => {
    if(a.date && b.date) return new Date(a.date) - new Date(b.date);
    if(a.date && !b.date) return -1;
    if(!a.date && b.date) return 1;
    return 0;
  });

  const timelineContainer = document.getElementById("timelineContainer");
  scenes.forEach(scene => {
    const card = document.createElement("div");
    card.className = "timeline-scene";
    card.draggable = true;
    card.dataset.sceneId = scene.sceneId;
    card.textContent = `${scene.date || "No Date"}: ${scene.content.substring(0,50)}`;
    timelineContainer.appendChild(card);
  });

  enableDragAndDrop(timelineContainer, scenes);
}

function getAllScenes() {
  if(!currentProject) return [];
  const all = [];
  currentProject.chapters.forEach(ch => {
    ch.scenes.forEach(s => {
      all.push(s);
    });
  });
  return all;
}

function enableDragAndDrop(container, scenes) {
  let draggedEl = null;
  
  container.addEventListener('dragstart', (e) => {
    if(e.target.classList.contains('timeline-scene')) {
      draggedEl = e.target;
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = getClosestSceneCard(e.target);
    if(target && target !== draggedEl) {
      // Highlight drop position
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = getClosestSceneCard(e.target);
    if(target && target !== draggedEl) {
      container.insertBefore(draggedEl, target.nextSibling);
      updateSceneOrder(container);
    }
  });
}

function getClosestSceneCard(el) {
  while(el && !el.classList.contains('timeline-scene')) {
    el = el.parentNode;
  }
  return el;
}

function updateSceneOrder(container) {
  // After dragging, we will assign new dates in chronological order
  // For simplicity, assign consecutive dates based on order if no dates set.
  
  const cards = [...container.querySelectorAll('.timeline-scene')];
  let currentDate = new Date();
  for(let i=0; i<cards.length; i++) {
    const sceneId = cards[i].dataset.sceneId;
    const scene = findScene(sceneId);
    if(scene) {
      if(!scene.date) {
        // Set date incrementally for scenes that have no date
        scene.date = new Date(currentDate.getTime() + i*86400000).toISOString().split('T')[0];
      }
    }
  }
  saveProjects();
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