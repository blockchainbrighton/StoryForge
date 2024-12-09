// js/ui.js: Handles rendering and DOM updates

import { currentProject, updateIndexesFromTags } from './data.js';

export function showEditor(scene) {
  document.getElementById("editorSection").classList.remove("hidden");
  const textarea = document.getElementById("sceneEditor");
  textarea.value = scene.content;
  textarea.dataset.sceneId = scene.sceneId;

  let dateInput = document.getElementById("sceneDateInput");
  if(!dateInput) {
    dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.id = "sceneDateInput";
    dateInput.style.display = "block";
    dateInput.style.marginTop = "0.5rem";
    const editorSection = document.getElementById("editorSection");
    editorSection.insertBefore(dateInput, editorSection.querySelector(".editor-actions"));
  }
  dateInput.value = scene.date || "";
}

export function hideEditor() {
  document.getElementById("editorSection").classList.add("hidden");
  document.getElementById("sceneEditor").dataset.sceneId = "";
}

export function renderProjectList(projects) {
  const select = document.getElementById("projectSelect");
  select.innerHTML = "";
  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.projectId;
    opt.textContent = p.title;
    select.appendChild(opt);
  });
}

export function renderChapters(chapters) {
  const chapterList = document.getElementById("chapterList");
  chapterList.innerHTML = "";
  chapters.forEach(ch => {
    const div = document.createElement("div");
    div.className = "chapter-item";
    div.textContent = ch.title;
    div.dataset.chapterId = ch.chapterId;
    chapterList.appendChild(div);
  });
}

export function renderScenes(chapter) {
  const scenesContainer = document.getElementById("scenesContainer");
  scenesContainer.innerHTML = "";
  chapter.scenes.forEach(scene => {
    const div = document.createElement("div");
    div.className = "scene-item";
    div.textContent = scene.content.substring(0,50) + (scene.content.length > 50 ? "..." : "");
    div.dataset.sceneId = scene.sceneId;
    scenesContainer.appendChild(div);
  });
}

export function updateIndexSidebar() {
  if(!currentProject) return;
  updateIndexesFromTags(currentProject);
  const charList = document.getElementById("characterIndex");
  const placeList = document.getElementById("placeIndex");
  charList.innerHTML = "";
  placeList.innerHTML = "";

  currentProject.characters.forEach(ch => {
    const li = document.createElement("li");
    li.textContent = ch.name;
    li.dataset.type = "character";
    li.dataset.name = ch.name;
    charList.appendChild(li);
  });

  currentProject.places.forEach(pl => {
    const li = document.createElement("li");
    li.textContent = pl.name;
    li.dataset.type = "place";
    li.dataset.name = pl.name;
    placeList.appendChild(li);
  });
}

export function renderSearchResults(results) {
  const ul = document.getElementById("searchResults");
  ul.innerHTML = "";
  results.forEach(r => {
    const li = document.createElement("li");
    li.textContent = `Ch: ${r.chapterTitle}, Scene: ${r.sceneId.substr(0,8)} - ${r.content.substring(0,50)}`;
    li.dataset.chapterId = r.chapterId;
    li.dataset.sceneId = r.sceneId;
    ul.appendChild(li);
  });
}

export function displaySelectedChapter(chapter) {
  document.getElementById("selectedChapterTitle").textContent = chapter.title;
}