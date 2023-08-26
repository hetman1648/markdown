import React, { useState, useEffect } from 'react';

const NUM_TEXTAREAS = 12;

function TextAreaRow({ index, content, content2, checkbox, onTitleChange, onBodyChange, onTagChange,onCheckboxChange }) {
  return (
  <div>
    <div class="row mb-1">
        <div class="col-4 py-1 bg-section-title">
            <div class="input-group">
                <span class="input-group-text border-0" id="basic-addon1">Section {index+1} Title</span>
                <select 
                  class="form-select border-0 bg-transparent" 
                  aria-label="select tag for section"
                  onChange={e => onTagChange(index, e.target.value)}
                >
                    <option value='h1'>h1</option>
                    <option value="h2" selected>h2</option>
                    <option value="h3">h3</option>
                    <option value="h4">h4</option>
                    <option value="h5">h5</option>
                    <option value="h6">h6</option>
                </select>
                <input 
                  type="checkbox" 
                  class="form-input-check" 
                  title="Expanded or collapsed" 
                  checked={checkbox}
                  onChange={e => onCheckboxChange(index, e.target.checked)}                  
                />
            </div>
        </div>
        <div class="col-6 py-1 bg-section-control">
            <input
              className="form-control"
              value={content}
              onChange={e => onTitleChange(index, e.target.value)}
            />
            
        </div>
        <div class="col-2 py-1 align-self-center">{countWords(content)} / {content.length}</div>
    </div>

    <div class="row mb-1">
          <div class="col-4 py-1 d-flex bg-section-body">
              <div class="input-group align-self-center">
                  <span class="input-group-text border-0" id="basic-addon1">Section {index+1} Body</span>
              </div>
          </div>
          <div class="col-6 py-1 bg-section-control">
            <textarea
              className="form-control"
              value={content2}
              onChange={e => onBodyChange(index, e.target.value)}
            />
          </div>
          <div class="col-2 py-1 align-self-center" title="The body contains {countWords(content2)} words and {content2.length} charachters ">{countWords(content2)} / {content2.length}</div>
      </div>
    </div>

  );
}

function countWords(str) {
  const words = str.trim().split(/\s+/);
  return str === "" ? 0 : words.length;
}

function App() {
  const [titles, setTitles] = useState(Array(NUM_TEXTAREAS).fill(''));
  const [bodies, setBodies] = useState(Array(NUM_TEXTAREAS).fill(''));
  const [tags, setTags] = useState(Array(NUM_TEXTAREAS).fill('h2'));
  const [checkboxes, setCheckboxes] = useState(Array(NUM_TEXTAREAS).fill(true));

  const [showInfo, setShowInfo] = useState(false);  

  const handleTitleChange = (index, value) => {
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);
  };

  const handleBodyChange = (index, value) => {
    const newBodies = [...bodies];
    newBodies[index] = value;
    setBodies(newBodies);
  };

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleCheckboxChange = (index, value) => {
    const newCheckboxes = [...checkboxes];
    newCheckboxes[index] = value;
    setCheckboxes(newCheckboxes);
  };

  const totalChars = 
    titles.reduce((total, text) => total + text.length, 0)
    + bodies.reduce((total, text) => total + text.length, 0);

  const totalWords =  titles.reduce((total, text) => total + countWords(text), 0)
  + bodies.reduce((total, text) => total + countWords(text), 0);


  const generateMarkdown = async () => {
    let markdown =  ''; // titles.join('\n\n'); // Separate each textarea content with two newline characters
    
    for (let i = 0; i < titles.length; i++) {
      // format: {FoldOut title="Burning Classics" open="true" tag="h2"}
      if (titles[i] === '') continue;
      let body = bodies[i];
      //if there is a next line inside body, return /n needs to be added
      if (body.includes('\n')) {
        body = body.replace(/\n/g, '\n\\n');
      }
      let isOpened = '';
      if (checkboxes[i]) {
        isOpened = 'open="true"';
      }
      markdown += `{FoldOut title="${titles[i]}" ${isOpened} tag="${tags[i]}"}\n${body}\n{/FoldOut}\n`;
    }
      
    // add texts to txtMarkdown textarea
    document.getElementById('txtMarkdown').value = markdown;
    // copy texts to clipboard

    try {
      await navigator.clipboard.writeText(markdown);
      // alert('Texts copied to clipboard!');
      
    } catch (err) {
      // alert('Failed to copy texts to clipboard');
    }
    setShowInfo(true);
  };

  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [showInfo]);
      
  return (
    <div className="container mt-4">
      <h1>Markdown Tool</h1>

      <main class="sp-main">
      <div class="sp-block">
          
          <div class="container text-center">
            

              <div class="row">
                <div class="col">

                  {titles.map((text, idx) => (
                      <TextAreaRow 
                        key={idx}
                        index={idx}
                        content={text}
                        content2={bodies[idx]}
                        tags={tags[idx]}
                        checkbox={checkboxes[idx]}
                        onTitleChange={handleTitleChange}
                        onBodyChange={handleBodyChange}
                        onTagChange={handleTagChange}
                        onCheckboxChange={handleCheckboxChange}
                      />
                    ))}
                </div>        
                <div class="col-md-auto valign-self-top">

                <div>
                {showInfo && <div className="alert alert-info mt-2">Generated and copied to clipboard!</div>}
                  <p class='text-info'>Total characters: <b>{totalChars}</b> Total words: <b>{totalWords}</b></p></div>
                    <button type="button" class="btn btn-primary" onClick={generateMarkdown}>Generate Markdown ↓</button>
                    <textarea class="form-control" id="txtMarkdown" rows="20"></textarea>
                </div>                      
            </div>
          </div>
      </div>
      </main>
    </div>

  );
}

export default App;
