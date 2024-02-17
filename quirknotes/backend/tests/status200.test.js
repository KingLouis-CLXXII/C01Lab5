test("1+2=3, empty array is empty", () => {
  expect(1 + 2).toBe(3);
  expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

async function createTestNote() {
  const response = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Test Note",
      content: "This is a test note.",
    }),
  });

  return response;
}

beforeEach(async () => {
  await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
});

test("/postNote - Post a note", async () => {
  const res = await createTestNote();
  const body = await res.json();

  expect(res.status).toBe(200);
  expect(body.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  await createTestNote();
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/getAllNotes`);
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  const res = await createTestNote();
  const noteId = (await res.json()).insertedId;
  const response = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toContain(noteId);  
});

test("/patchNote - Patch with content and title", async () => {
  const res = await createTestNote();
  const noteId = (await res.json()).insertedId;
  const newTitle = "Updated Title";
  const newContent = "Updated Content";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle, content: newContent }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/patchNote - Patch with just title", async () => {
  const res = await createTestNote();
  const noteId = (await res.json()).insertedId;
  const newTitle = "Updated Title";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/patchNote - Patch with just content", async () => {
  const res = await createTestNote();
  const noteId = (await res.json()).insertedId;
  const newContent = "Updated Content";

  const response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: newContent }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/deleteAllNotes - Delete one note", async () => {
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
});

test("/deleteAllNotes - Delete three notes", async () => {
  await createTestNote();
  await createTestNote();
  await createTestNote();
  const response = await fetch(`${SERVER_URL}/deleteAllNotes`, { method: "DELETE" });
  const body = await response.json();

  expect(response.status).toBe(200);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const res = await createTestNote();
  const noteId = (await res.json()).insertedId;
  const color = "#FFFFFF";

  const response = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ color }),
  });
  const body = await response.json();

  expect(response.status).toBe(200);
  expect(body.message).toBe("Note color updated successfully.");
});