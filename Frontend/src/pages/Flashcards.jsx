import { useEffect, useMemo, useState } from 'react';
import {
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RotateCcw
} from 'lucide-react';

import {
  getStudentFlashcards,
  reviewFlashcard
} from '../services/api';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [skillFilter, setSkillFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedUser = JSON.parse(localStorage.getItem('idp-user'));
  const studentId = savedUser?.student_id;

  useEffect(() => {
    async function loadFlashcards() {
      try {
        setLoading(true);
        setError(null);

        const data = await getStudentFlashcards(studentId);

        const uniqueFlashcards = Array.from(
          new Map(data.map(card => [card.id, card])).values()
        );

        setFlashcards(uniqueFlashcards);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      loadFlashcards();
    } else {
      setError('Student not found. Please log in again.');
      setLoading(false);
    }
  }, [studentId]);

  const skills = useMemo(() => {
    return [
      ...new Set(
        flashcards
          .map(card => card.skill)
          .filter(Boolean)
      )
    ].sort();
  }, [flashcards]);

  const subjects = useMemo(() => {
    return [
      ...new Set(
        flashcards
          .map(card => card.subject)
          .filter(Boolean)
      )
    ].sort();
  }, [flashcards]);

  const matchingCards = useMemo(() => {
    return flashcards.filter(card => {
      const matchesSkill =
        skillFilter === 'all' ||
        card.skill === skillFilter;

      const matchesSubject =
        subjectFilter === 'all' ||
        card.subject === subjectFilter;

      return matchesSkill && matchesSubject;
    });
  }, [flashcards, skillFilter, subjectFilter]);

  const currentCard = matchingCards[cardIndex];

  const reviewedCount = flashcards.filter(
    card => card.reviewed
  ).length;

  const masteredCount = flashcards.filter(
    card => card.mastered
  ).length;

  const changeSkillFilter = value => {
    setSkillFilter(value);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const changeSubjectFilter = value => {
    setSubjectFilter(value);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const move = direction => {
    if (matchingCards.length === 0) return;

    setCardIndex(
      index =>
        (index + direction + matchingCards.length) %
        matchingCards.length
    );

    setIsFlipped(false);
  };

  const markCard = async isKnown => {
    if (!currentCard) return;

    try {
      await reviewFlashcard(
        currentCard.id,
        studentId,
        isKnown
      );

      setFlashcards(current =>
        current.map(card =>
          card.id === currentCard.id
            ? {
                ...card,
                reviewed: true,
                mastered: isKnown
              }
            : card
        )
      );

      setIsFlipped(false);

      if (cardIndex < matchingCards.length - 1) {
        setCardIndex(index => index + 1);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save flashcard progress');
    }
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        Loading flashcards...
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '1040px',
        margin: '0 auto'
      }}
    >
      <div
        className="page-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          alignItems: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h1 className="page-title text-gradient">
            Smart Flashcards
          </h1>

          <p className="text-muted">
            Review concepts matched to your skills and subjects.
          </p>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <BrainCircuit
            color="var(--accent)"
            size={22}
          />

          <span>
            <strong>{masteredCount}</strong> mastered of{' '}
            {flashcards.length}
          </span>
        </div>
      </div>

      <div
        className="glass-panel"
        style={{
          padding: '18px',
          marginBottom: '22px',
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '14px'
        }}
      >
        <label
          className="text-muted"
          style={{ fontSize: '0.85rem' }}
        >
          Skill

          <select
            className="input-glass"
            value={skillFilter}
            onChange={event =>
              changeSkillFilter(event.target.value)
            }
            style={{ marginTop: '7px' }}
          >
            <option value="all">
              All skills
            </option>

            {skills.map(skill => (
              <option
                key={skill}
                value={skill}
              >
                {skill}
              </option>
            ))}
          </select>
        </label>

        <label
          className="text-muted"
          style={{ fontSize: '0.85rem' }}
        >
          Subject

          <select
            className="input-glass"
            value={subjectFilter}
            onChange={event =>
              changeSubjectFilter(event.target.value)
            }
            style={{ marginTop: '7px' }}
          >
            <option value="all">
              All subjects
            </option>

            {subjects.map(subject => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>
        </label>

        <div
          style={{
            alignSelf: 'end',
            fontSize: '0.9rem'
          }}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontWeight: 600
            }}
          >
            {reviewedCount}
          </span>{' '}
          cards reviewed
        </div>
      </div>

      {currentCard ? (
        <>
          <div
            className="flashcard-shell"
            onClick={() =>
              setIsFlipped(flipped => !flipped)
            }
            role="button"
            tabIndex="0"
            onKeyDown={event => {
              if (event.key === 'Enter') {
                setIsFlipped(flipped => !flipped);
              }
            }}
          >
            <div
              className={`flashcard ${
                isFlipped ? 'is-flipped' : ''
              }`}
            >
              <section className="flashcard-face flashcard-front">
                <span className="flashcard-tag">
                  {currentCard.subject} · {currentCard.skill}
                </span>

                <h2>{currentCard.question}</h2>

                <p>
                  <RotateCcw size={16} />
                  Tap to reveal the answer
                </p>
              </section>

              <section className="flashcard-face flashcard-back">
                <span className="flashcard-tag">
                  Answer
                </span>

                <p className="flashcard-answer">
                  {currentCard.answer}
                </p>

                <p>
                  <RotateCcw size={16} />
                  Tap to see the question
                </p>
              </section>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-muted">
              {cardIndex + 1} of {matchingCards.length}
            </span>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => move(1)}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>

          {isFlipped && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '22px',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => markCard(false)}
              >
                <Lightbulb size={18} />
                Review again
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => markCard(true)}
              >
                <Check size={18} />
                I know this
              </button>
            </div>
          )}
        </>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '42px',
            textAlign: 'center'
          }}
        >
          <h3>
            No flashcards match these filters.
          </h3>

          <p
            className="text-muted"
            style={{ marginTop: '8px' }}
          >
            Try another skill or subject.
          </p>
        </div>
      )}
    </div>
  );
}