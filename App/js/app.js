// js/app.js: Main application logic, event listeners, initialization

import { createNewProject, addProject, loadProjects, projects, selectProject, currentProject, addChapter, addSceneToChapter, saveProjects } from './data.js';
import { renderProjectList, renderChapters, renderScenes, showEditor, hideEditor, updateIndexSidebar, renderSearchResults, displaySelectedChapter } from './ui.js';
import { saveSceneContent, tagCurrentScene } from './editor.js';
import { searchScenes } from './search.js';
import { showTimelineView } from './timeline.js';
import { loadTheme, nextTheme } from './theme.js';

// Add the following lines at the end of DOMContentLoaded event:
document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  renderProjectList(projects);
  setupEventListeners();
  loadTheme(); // Load the saved theme on startup
});

let selectedChapter = null;
let selectedScene = null;

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  renderProjectList(projects);
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById("newProjectBtn").addEventListener("click", () => {
    const title = prompt("Project Title:");
    if(title) {
      const project = createNewProject(title);
      addProject(project);
      selectProject(project.projectId);
      renderProjectList(projects);
      onProjectSelected();
    }
  });

  document.getElementById("loadProjectBtn").addEventListener("click", () => {
    const select = document.getElementById("projectSelect");
    const pid = select.value;
    selectProject(pid);
    onProjectSelected();
  });

  document.getElementById("addChapterBtn").addEventListener("click", () => {
    if(!currentProject) return;
    const chTitle = prompt("Chapter Title:");
    if(chTitle) {
      const chapter = addChapter(currentProject, chTitle);
      renderChapters(currentProject.chapters);
    }
  });

  document.getElementById("chapterList").addEventListener("click", (e) => {
    if(e.target.classList.contains("chapter-item")) {
      const chId = e.target.dataset.chapterId;
      selectedChapter = currentProject.chapters.find(c => c.chapterId === chId);
      selectedScene = null;
      displaySelectedChapter(selectedChapter);
      renderScenes(selectedChapter);
      hideEditor();
    }
  });

  document.getElementById("scenesContainer").addEventListener("click", (e) => {
    if(e.target.classList.contains("scene-item")) {
      const sceneId = e.target.dataset.sceneId;
      selectedScene = selectedChapter.scenes.find(s => s.sceneId === sceneId);
      showEditor(selectedScene);
    } else {
      // Add scene if clicked empty space?
      const add = confirm("Add new scene here?");
      if(add && selectedChapter) {
        const s = addSceneToChapter(selectedChapter);
        renderScenes(selectedChapter);
      }
    }
  });

  document.getElementById("saveSceneBtn").addEventListener("click", () => {
    if(!selectedScene) return;
    saveSceneContent(selectedScene.sceneId);
    renderScenes(selectedChapter);
  });

  document.getElementById("closeEditorBtn").addEventListener("click", () => {
    hideEditor();
  });

  document.getElementById("tagCharacterBtn").addEventListener("click", () => {
    tagCurrentScene("character");
    updateIndexSidebar();
  });

  document.getElementById("tagPlaceBtn").addEventListener("click", () => {
    tagCurrentScene("place");
    updateIndexSidebar();
  });

  document.getElementById("themeToggleBtn").addEventListener("click", () => {
    nextTheme();
  });
}

  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    const results = searchScenes(query);
    renderSearchResults(results);
  });

  document.getElementById("searchResults").addEventListener("click", (e) => {
    if(e.target.tagName === "LI") {
      const chId = e.target.dataset.chapterId;
      const scId = e.target.dataset.sceneId;
      selectedChapter = currentProject.chapters.find(c => c.chapterId === chId);
      selectedScene = selectedChapter.scenes.find(s => s.sceneId === scId);
      displaySelectedChapter(selectedChapter);
      renderScenes(selectedChapter);
      showEditor(selectedScene);
    }
  });

  document.getElementById("viewTimelineBtn").addEventListener("click", () => {
    showTimelineView();
  });

  document.getElementById("viewOutlineBtn").addEventListener("click", () => {
    // Outline is basically the chapter list, already visible
    alert("Outline view is currently the default view.");
  });

  document.getElementById("characterIndex").addEventListener("click", (e) => {
    if(e.target.tagName === "LI") {
      const name = e.target.dataset.name;
      filterByTag(`character:${name}`);
    }
  });

  document.getElementById("placeIndex").addEventListener("click", (e) => {
    if(e.target.tagName === "LI") {
      const name = e.target.dataset.name;
      filterByTag(`place:${name}`);
    }
  });


function onProjectSelected() {
  if(!currentProject) return;
  renderChapters(currentProject.chapters);
  updateIndexSidebar();
  // Clear editor and scenes
  document.getElementById("selectedChapterTitle").textContent = "";
  document.getElementById("scenesContainer").innerHTML = "";
  hideEditor();
}

function filterByTag(tag) {
  if(!currentProject) return;
  const results = [];
  currentProject.chapters.forEach(ch => {
    ch.scenes.forEach(s => {
      if(s.tags.includes(tag)) {
        results.push({
          chapterId: ch.chapterId,
          chapterTitle: ch.title,
          sceneId: s.sceneId,
          content: s.content
        });
      }
    });
  });
  renderSearchResults(results);
}