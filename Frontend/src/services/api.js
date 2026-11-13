const API_URL = 'https://idp-recommendation-system-1.onrender.com';

export async function getStudent(studentId) {
    const response = await fetch(`${API_URL}/students/${studentId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch student");
    }

    return response.json();
}

export async function getCareers() {
    const response = await fetch(`${API_URL}/careers`);

    if (!response.ok) {
        throw new Error("Failed to fetch careers");
    }

    return response.json();
}

export async function getSkills() {
    const response = await fetch(`${API_URL}/skills`);

    if (!response.ok) {
        throw new Error("Failed to fetch skills");
    }

    return response.json();
}

export async function getDashboard(studentId) {
    const response = await fetch(`${API_URL}/dashboard/${studentId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
    }

    return response.json();
}

export async function getRecommendations(studentId) {
    const response = await fetch(`${API_URL}/recommendations/${studentId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
    }

    return response.json();
}

export async function getRoadmap(studentId) {
    const response = await fetch(`${API_URL}/roadmap/${studentId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch roadmap");
    }

    return response.json();
}

export async function getStudentFlashcards(studentId) {
    const response = await fetch(`${API_URL}/flashcards/${studentId}`);

    if (!response.ok) {
        throw new Error("Failed to fetch flashcards");
    }

    return response.json();
}

export async function submitAssessment(data) {
    const response = await fetch(`${API_URL}/assessment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to save assessment");
    }

    return response.json();
}

export async function setCareerGoal(data) {
    const response = await fetch(`${API_URL}/career-goal`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Failed to save career goal");
    }

    return response.json();
}

export async function reviewFlashcard(flashcardId, studentId, mastered) {
    const response = await fetch(
        `${API_URL}/flashcards/${flashcardId}/review?student_id=${studentId}&mastered=${mastered}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to save flashcard progress");
    }

    return response.json();
}

export async function completeResource(resourceId, studentId) {
    const response = await fetch(
        `${API_URL}/resources/${resourceId}/complete?student_id=${studentId}`,
        {
            method: "POST"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to complete resource");
    }

    return response.json();
}
export async function getAdminDashboard() {
    const response = await fetch(
        `${API_URL}/admin/dashboard`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard");
    }

    return response.json();
}

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        throw new Error("Login request failed");
    }

    return response.json();
}
export async function registerUser(name, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Registration failed");
    }

    return response.json();
}