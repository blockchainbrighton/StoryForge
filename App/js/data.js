// js/data.js: Handles data structures, loading, and saving

export let currentProject = null;
export let projects = [];

export function createNewProject(title) {
  return {
    projectId: generateUUID(),
    title: title,
    chapters: [],
    characters: [],
    places: [],
    notes: [],
    settings: {
      autosaveInterval: 5000
    }
  };
}

export function addChapter(project, title) {
  const chapter = {
    chapterId: generateUUID(),
    title,
    scenes: []
  };
  project.chapters.push(chapter);
  saveProjects();
  return chapter;
}

export function addSceneToChapter(chapter, content = "") {
    const scene = {
      sceneId: generateUUID(),
      type: "scene",
      content: content,
      tags: [],
      summary: "",
      timestamp: null,
      date: null // new property for timeline
    };
    chapter.scenes.push(scene);
    saveProjects();
    return scene;
  }

export function addTagToScene(scene, tag) {
  if(!scene.tags.includes(tag)) {
    scene.tags.push(tag);
    saveProjects();
  }
}

export function saveProjects() {
  localStorage.setItem("storyforgeProjects", JSON.stringify(projects));
}

export function loadProjects() {
  const data = localStorage.getItem("storyforgeProjects");
  if(data) {
    projects = JSON.parse(data);
  } else {
    projects = [];
  }
}

export function selectProject(projectId) {
  currentProject = projects.find(p => p.projectId === projectId) || null;
}

export function addProject(project) {
  projects.push(project);
  saveProjects();
}

export function updateIndexesFromTags(project) {
  // Clear current indexes
  project.characters = [];
  project.places = [];

  // Extract tags from all scenes
  project.chapters.forEach(ch => {
    ch.scenes.forEach(scene => {
      scene.tags.forEach(tag => {
        const [type, name] = tag.split(":");
        if(type === "character" && !project.characters.find(c => c.name === name)) {
          project.characters.push({ characterId: generateUUID(), name, description:""});
        }
        if(type === "place" && !project.places.find(pl => pl.name === name)) {
          project.places.push({ placeId: generateUUID(), name, description:""});
        }
      });
    });
  });
  saveProjects();
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c==='x'?r:(r&0x3|0x8);
    return v.toString(16);
  });
}