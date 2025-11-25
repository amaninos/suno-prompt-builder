// Suno Prompt Builder - Main Application Logic

class SunoPromptBuilder {
    constructor() {
        this.data = {};
        this.formSections = document.getElementById('form-sections');
        this.promptOutput = document.getElementById('prompt-output'); // Legacy, hidden
        this.promptMusic = document.getElementById('prompt-music');
        this.promptLyrics = document.getElementById('prompt-lyrics');
        this.charCount = document.getElementById('char-count'); // Legacy
        this.charCountMusic = document.getElementById('char-count-music');
        this.charCountLyrics = document.getElementById('char-count-lyrics');
        this.generateBtn = document.getElementById('generate-btn');
        this.randomBtn = document.getElementById('random-btn');
        this.copyBtn = document.getElementById('copy-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.optimizeBtn = document.getElementById('optimize-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.historyList = document.getElementById('history-list');
        this.historyEmpty = document.getElementById('history-empty');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        this.templatesList = document.getElementById('templates-list');
        this.presetsList = document.getElementById('presets-list');
        this.presetsEmpty = document.getElementById('presets-empty');
        this.savePresetBtn = document.getElementById('save-preset-btn');
        this.livePreviewToggle = document.getElementById('live-preview-toggle');
        this.livePreviewTimeout = null;
        this.analysisModal = document.getElementById('analysis-modal');
        this.closeAnalysisModal = document.getElementById('close-analysis-modal');
        this.cancelAnalysisBtn = document.getElementById('cancel-analysis-btn');
        this.applyOptimizationBtn = document.getElementById('apply-optimization-btn');
        this.analysisResults = document.getElementById('analysis-results');
        this.optimizedPrompt = '';
        this.exportBtn = document.getElementById('export-btn');
        this.exportJsonBtn = document.getElementById('export-json-btn');
        this.exportTxtBtn = document.getElementById('export-txt-btn');
        this.importBtn = document.getElementById('import-btn');
        this.importFileInput = document.getElementById('import-file-input');
        this.exportDropdown = document.querySelector('.dropdown-menu');
        this.themeToggle = document.getElementById('theme-toggle');
        this.lyricSummaryBtn = null;
        this.lyricDraftOutput = null;
        this.lyricDraftCopyBtn = null;
        this.lyricDraftRegenBtn = null;
        this.currentLyricDraft = '';
        this.lyricPreviewTimeout = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderForm();
        this.attachEventListeners();
        this.setupTabs();
        this.loadHistory();
        this.loadTemplates();
        this.loadPresets();
        this.initTheme();
        this.setupKeyboardShortcuts();
    }

    async loadData() {
        const dataFiles = [
            'data/genres.json',
            'data/subgenres.json',
            'data/turkish_makam.json',
            'data/turkish_music_styles.json',
            'data/origin_language.json',
            'data/world_music_regions.json',
            'data/world_music_details.json',
            'data/instruments.json',
            'data/vocals.json',
            'data/production.json',
            'data/structure_flow.json',
            'data/lyrics.json'
        ];

        try {
            const promises = dataFiles.map(file => fetch(file).then(r => r.json()));
            const results = await Promise.all(promises);
            
            this.data = {
                genres: results[0].genre,
                subgenres: results[1].subgenre,
                makam: results[2].makam,
                turkishMusicStyles: results[3].turkish_music_styles,
                originLanguage: results[4].origin_language,
                worldMusic: results[5].regions,
                worldMusicDetails: results[6],
                instruments: results[7],
                vocals: results[8],
                production: results[9],
                structureFlow: results[10].structure_flow,
                lyrics: results[11]
            };
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data files. Please ensure all JSON files are present.');
        }
    }

    renderForm() {
        this.formSections.innerHTML = '';

        // Genre & Sub-Genre
        this.createSection('Genre & Sub-Genre', [
            { label: 'Genre', id: 'genre', options: this.data.genres || [] },
            { label: 'Sub-Genre', id: 'subgenre', options: this.data.subgenres || [] }
        ]);

        // Origin / Language
        this.createSection('Origin / Language', [
            { label: 'Origin / Language', id: 'origin_language', options: this.data.originLanguage || [] }
        ]);

        // Turkish Music Styles
        this.createSection('Turkish Music Styles', [
            { label: 'Turkish Music Style', id: 'turkish_music_style', options: this.data.turkishMusicStyles || [] }
        ]);

        // Turkish Makam
        this.createSection('Turkish Makam', [
            { label: 'Makam Style', id: 'makam', options: this.data.makam || [] }
        ]);

        // World Music
        this.createWorldMusicSection();

        // Tempo & Key
        this.createTempoKeySection();

        // Mood
        this.createSection('Mood', [
            { label: 'Mood', id: 'mood', options: this.data.instruments?.mood || [] }
        ]);

        // Harmony Type
        this.createSection('Harmony Type', [
            { label: 'Harmony', id: 'harmony', options: this.data.instruments?.harmony || [] }
        ]);

        // Rhythm & Percussion
        this.createSection('Rhythm & Percussion', [
            { label: 'Rhythm', id: 'rhythm', options: this.data.instruments?.rhythm || [] },
            { label: 'Percussion', id: 'percussion', options: this.data.instruments?.percussion || [] }
        ]);

        // Bass
        this.createSection('Bass', [
            { label: 'Bass', id: 'bass', options: this.data.instruments?.bass || [] }
        ]);

        // Lead Instrument
        this.createSection('Lead Instrument', [
            { label: 'Lead Instrument', id: 'lead', options: this.data.instruments?.lead || [] }
        ]);

        // Accompaniment Instrument
        this.createSection('Accompaniment', [
            { label: 'Accompaniment', id: 'accompaniment', options: this.data.instruments?.accompaniment || [] }
        ]);

        // Vocals
        this.createSection('Vocals', [
            { label: 'Vocal Type', id: 'vocal_type', options: this.data.vocals?.vocal_type || [] },
            { label: 'Vocal Range', id: 'vocal_range', options: this.data.vocals?.vocal_range || [] },
            { label: 'Vocal Style', id: 'vocal_style', options: this.data.vocals?.vocal_style || [] },
            { label: 'Vocal Timbre', id: 'vocal_timbre', options: this.data.vocals?.vocal_timbre || [] },
            { label: 'Vocal Effects', id: 'vocal_effects', options: this.data.vocals?.vocal_effects || [] }
        ]);

        // Structure & Dynamic Flow
        this.createSection('Structure & Dynamic Flow', [
            { label: 'Structure & Flow', id: 'structure_flow', options: this.data.structureFlow || [] }
        ]);

        // Lyrics Builder
        this.createLyricsSection();

        // Mixing & Production
        this.createSection('Mixing & Production', [
            { label: 'Mixing Style', id: 'mixing_style', options: this.data.production?.mixing_style || [] },
            { label: 'Production Style', id: 'production_style', options: this.data.production?.production_style || [] }
        ]);
        
        // Setup live preview after form is rendered
        this.setupLivePreview();
        this.setupLyricPreviewWatchers();
    }

    getPlaceholderForField(fieldId) {
        const placeholders = {
            'genre': 'Select Genre...',
            'subgenre': 'Select Sub-Genre...',
            'makam': 'Select Makam Style...',
            'origin_language': 'Select Origin / Language...',
            'turkish_music_style': 'Select Turkish Music Style...',
            'world_region': 'Select Region...',
            'world_tradition': 'Select Tradition...',
            'world_instruments': 'Select Instruments...',
            'world_rhythmic_feel': 'Select Rhythmic Feel...',
            'world_scale_mode': 'Select Scale / Mode...',
            'world_musical_texture': 'Select Musical Texture...',
            'world_performance_context': 'Select Performance Context...',
            'world_vocal_style': 'Select Vocal Style...',
            'world_atmosphere': 'Select Atmosphere...',
            'tempo': 'Select Tempo...',
            'mood': 'Select Mood...',
            'harmony': 'Select Harmony...',
            'rhythm': 'Select Rhythm...',
            'percussion': 'Select Percussion...',
            'bass': 'Select Bass...',
            'lead': 'Select Lead Instrument...',
            'accompaniment': 'Select Accompaniment...',
            'vocal_type': 'Select Vocal Type...',
            'vocal_range': 'Select Vocal Range...',
            'vocal_style': 'Select Vocal Style...',
            'vocal_timbre': 'Select Vocal Timbre...',
            'vocal_effects': 'Select Vocal Effects...',
            'structure_flow': 'Select Structure & Flow...',
            'mixing_style': 'Select Mixing Style...',
            'production_style': 'Select Production Style...',
            'key-select': 'Select Key...',
            'lyric_theme': 'Select Lyric Theme...',
            'lyric_emotion': 'Select Lyric Emotion...',
            'lyric_story_arc': 'Select Story Arc...',
            'lyric_perspective': 'Select Perspective...',
            'lyric_tense': 'Select Tense...',
            'lyric_rhyme': 'Select Rhyme Scheme...',
            'lyric_language': 'Select Lyric Language...',
            'lyric_structure': 'Select Lyric Structure...'
        };
        return placeholders[fieldId] || `Select...`;
    }

    createSection(title, fields) {
        const section = document.createElement('div');
        section.className = 'form-section';
        section.dataset.sectionTitle = title;
        
        const header = document.createElement('div');
        header.className = 'form-section-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'section-header-left';
        headerLeft.innerHTML = `<h3>${title}</h3>`;
        
        const headerRight = document.createElement('div');
        headerRight.className = 'section-header-right';
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'section-action-btn pin-btn';
        pinBtn.title = 'Pin section to top';
        pinBtn.innerHTML = '📌';
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePinSection(title);
        });
        
        const hideBtn = document.createElement('button');
        hideBtn.className = 'section-action-btn hide-btn';
        hideBtn.title = 'Hide section';
        hideBtn.innerHTML = '👁️';
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHideSection(title);
        });
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▼';
        
        headerRight.appendChild(pinBtn);
        headerRight.appendChild(hideBtn);
        headerRight.appendChild(toggleIcon);
        
        header.appendChild(headerLeft);
        header.appendChild(headerRight);
        
        const content = document.createElement('div');
        content.className = 'form-section-content';
        
        fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.id);
            
            const select = document.createElement('select');
            select.id = field.id;
            select.name = field.id;
            
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = this.getPlaceholderForField(field.id);
            select.appendChild(defaultOption);
            
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });
            
            group.appendChild(label);
            group.appendChild(select);
            content.appendChild(group);
        });
        
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
        
        section.appendChild(header);
        section.appendChild(content);
        this.formSections.appendChild(section);
        
        // Apply saved preferences
        this.applySectionPreferences(section, title);
    }

    createLyricsSection() {
        const section = document.createElement('div');
        section.className = 'form-section';
        section.dataset.sectionTitle = 'Lyrics Builder';

        const header = document.createElement('div');
        header.className = 'form-section-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'section-header-left';
        headerLeft.innerHTML = `<h3>Lyrics Builder</h3>`;
        
        const headerRight = document.createElement('div');
        headerRight.className = 'section-header-right';
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'section-action-btn pin-btn';
        pinBtn.title = 'Pin section to top';
        pinBtn.innerHTML = '📌';
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePinSection('Lyrics Builder');
        });
        
        const hideBtn = document.createElement('button');
        hideBtn.className = 'section-action-btn hide-btn';
        hideBtn.title = 'Hide section';
        hideBtn.innerHTML = '👁️';
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHideSection('Lyrics Builder');
        });
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▼';
        
        headerRight.appendChild(pinBtn);
        headerRight.appendChild(hideBtn);
        headerRight.appendChild(toggleIcon);
        
        header.appendChild(headerLeft);
        header.appendChild(headerRight);

        const content = document.createElement('div');
        content.className = 'form-section-content';

        const lyricData = this.data.lyrics || {};
        const presets = lyricData.presets || [];

        if (presets.length) {
            const presetGroup = document.createElement('div');
            presetGroup.className = 'form-group lyric-preset-group';
            const presetLabel = document.createElement('label');
            presetLabel.textContent = 'Lyric Presets';
            presetLabel.setAttribute('for', 'lyric_preset_select');
            const presetSelect = document.createElement('select');
            presetSelect.id = 'lyric_preset_select';
            presetSelect.innerHTML = '<option value=\"\">Select preset...</option>';
            presets.forEach((preset, index) => {
                const opt = document.createElement('option');
                opt.value = index;
                opt.textContent = preset.name;
                opt.title = preset.description || '';
                presetSelect.appendChild(opt);
            });
            const presetButton = document.createElement('button');
            presetButton.type = 'button';
            presetButton.className = 'btn btn-secondary lyric-preset-btn';
            presetButton.textContent = 'Load preset';
            presetButton.addEventListener('click', () => {
                const idx = presetSelect.value;
                if (idx === '') {
                    alert('Please select a preset first.');
                    return;
                }
                this.applyLyricPreset(presets[idx]);
            });
            presetGroup.appendChild(presetLabel);
            presetGroup.appendChild(presetSelect);
            presetGroup.appendChild(presetButton);
            content.appendChild(presetGroup);
        }

        const lyricSelects = [
            { label: 'Lyric Theme', id: 'lyric_theme', options: lyricData.lyric_theme || [] },
            { label: 'Lyric Emotion', id: 'lyric_emotion', options: lyricData.lyric_emotion || [] },
            { label: 'Story Arc', id: 'lyric_story_arc', options: lyricData.lyric_story_arc || [] },
            { label: 'Perspective', id: 'lyric_perspective', options: lyricData.lyric_perspective || [] },
            { label: 'Tense', id: 'lyric_tense', options: lyricData.lyric_tense || [] },
            { label: 'Rhyme Scheme', id: 'lyric_rhyme', options: lyricData.lyric_rhyme || [] },
            { label: 'Lyric Language', id: 'lyric_language', options: lyricData.lyric_language || [] },
            { label: 'Lyric Structure', id: 'lyric_structure', options: lyricData.lyric_structure || [] }
        ];

        lyricSelects.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = field.label;
            label.setAttribute('for', field.id);

            const select = document.createElement('select');
            select.id = field.id;
            select.name = field.id;

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = this.getPlaceholderForField(field.id);
            select.appendChild(defaultOption);

            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                select.appendChild(opt);
            });

            group.appendChild(label);
            group.appendChild(select);
            content.appendChild(group);
        });

        // Keyword input
        const keywordGroup = document.createElement('div');
        keywordGroup.className = 'form-group';
        const keywordLabel = document.createElement('label');
        keywordLabel.textContent = 'Keyword & Imagery Prompts';
        keywordLabel.setAttribute('for', 'lyric_keywords');
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.id = 'lyric_keywords';
        keywordInput.name = 'lyric_keywords';
        keywordInput.placeholder = 'e.g. neon lights, midnight rain, static noise';
        keywordInput.className = 'text-input';
        keywordInput.dataset.fieldType = 'text';
        keywordGroup.appendChild(keywordLabel);
        keywordGroup.appendChild(keywordInput);
        content.appendChild(keywordGroup);

        // Custom lyrics textarea
        const customGroup = document.createElement('div');
        customGroup.className = 'form-group';
        const customLabel = document.createElement('label');
        customLabel.textContent = 'Custom Lyric Snippet (optional)';
        customLabel.setAttribute('for', 'lyric_custom_text');
        const customTextarea = document.createElement('textarea');
        customTextarea.id = 'lyric_custom_text';
        customTextarea.name = 'lyric_custom_text';
        customTextarea.placeholder = 'Add a custom hook, verse lines, or spoken intro...';
        customTextarea.rows = 4;
        customTextarea.className = 'textarea-input';
        customTextarea.dataset.fieldType = 'text';
        customGroup.appendChild(customLabel);
        customGroup.appendChild(customTextarea);
        content.appendChild(customGroup);

        // Summary helper
        const summaryActions = document.createElement('div');
        summaryActions.className = 'lyric-summary-actions';
        const summaryHint = document.createElement('p');
        summaryHint.className = 'field-hint';
        summaryHint.textContent = 'Need a ≤200 character version for Suno Lyrics field?';
        summaryActions.appendChild(summaryHint);
        const summaryButton = document.createElement('button');
        summaryButton.type = 'button';
        summaryButton.className = 'btn btn-secondary lyric-summary-btn';
        summaryButton.textContent = 'Copy 200-char summary';
        summaryButton.addEventListener('click', () => this.copyLyricSummary());
        summaryActions.appendChild(summaryButton);
        content.appendChild(summaryActions);
        this.lyricSummaryBtn = summaryButton;

        // Lyric draft preview
        const previewCard = document.createElement('div');
        previewCard.className = 'lyric-preview-card';
        const previewHeader = document.createElement('div');
        previewHeader.className = 'lyric-preview-header';
        const previewTitle = document.createElement('div');
        previewTitle.className = 'lyric-preview-title';
        const previewHeading = document.createElement('h4');
        previewHeading.textContent = 'Lyric Draft Preview';
        const previewHint = document.createElement('p');
        previewHint.className = 'field-hint';
        previewHint.textContent = 'Auto-generated snippet updates as you tweak lyric settings.';
        previewTitle.appendChild(previewHeading);
        previewTitle.appendChild(previewHint);

        const previewActions = document.createElement('div');
        previewActions.className = 'lyric-preview-actions';
        const regenerateBtn = document.createElement('button');
        regenerateBtn.type = 'button';
        regenerateBtn.className = 'btn btn-secondary lyric-preview-btn';
        regenerateBtn.textContent = 'Regenerate lines';
        regenerateBtn.addEventListener('click', () => this.updateLyricDraftPreview());
        const copyDraftBtn = document.createElement('button');
        copyDraftBtn.type = 'button';
        copyDraftBtn.className = 'btn btn-secondary lyric-preview-btn';
        copyDraftBtn.textContent = 'Copy draft';
        copyDraftBtn.addEventListener('click', () => this.copyLyricDraft());
        previewActions.appendChild(regenerateBtn);
        previewActions.appendChild(copyDraftBtn);

        previewHeader.appendChild(previewTitle);
        previewHeader.appendChild(previewActions);
        previewCard.appendChild(previewHeader);

        const previewOutput = document.createElement('pre');
        previewOutput.className = 'lyric-preview-output';
        previewOutput.textContent = 'Select lyric options to preview a draft snippet.';
        previewCard.appendChild(previewOutput);
        content.appendChild(previewCard);

        this.lyricDraftOutput = previewOutput;
        this.lyricDraftCopyBtn = copyDraftBtn;
        this.lyricDraftRegenBtn = regenerateBtn;

        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });

        section.appendChild(header);
        section.appendChild(content);
        this.formSections.appendChild(section);
        
        // Apply saved preferences
        this.applySectionPreferences(section, 'Lyrics Builder');
    }

    createTempoKeySection() {
        const section = document.createElement('div');
        section.className = 'form-section';
        section.dataset.sectionTitle = 'Tempo & Key';
        
        const header = document.createElement('div');
        header.className = 'form-section-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'section-header-left';
        headerLeft.innerHTML = `<h3>Tempo & Key</h3>`;
        
        const headerRight = document.createElement('div');
        headerRight.className = 'section-header-right';
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'section-action-btn pin-btn';
        pinBtn.title = 'Pin section to top';
        pinBtn.innerHTML = '📌';
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePinSection('Tempo & Key');
        });
        
        const hideBtn = document.createElement('button');
        hideBtn.className = 'section-action-btn hide-btn';
        hideBtn.title = 'Hide section';
        hideBtn.innerHTML = '👁️';
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHideSection('Tempo & Key');
        });
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▼';
        
        headerRight.appendChild(pinBtn);
        headerRight.appendChild(hideBtn);
        headerRight.appendChild(toggleIcon);
        
        header.appendChild(headerLeft);
        header.appendChild(headerRight);
        
        const content = document.createElement('div');
        content.className = 'form-section-content';
        
        // BPM Slider
        const bpmGroup = document.createElement('div');
        bpmGroup.className = 'form-group';
        const bpmLabel = document.createElement('label');
        bpmLabel.textContent = 'BPM';
        bpmLabel.setAttribute('for', 'bpm-slider');
        const bpmContainer = document.createElement('div');
        bpmContainer.className = 'slider-container';
        
        const bpmSlider = document.createElement('input');
        bpmSlider.type = 'range';
        bpmSlider.id = 'bpm-slider';
        bpmSlider.name = 'bpm-slider';
        bpmSlider.min = '40';
        bpmSlider.max = '200';
        bpmSlider.value = '120';
        bpmSlider.className = 'slider';
        
        const bpmValue = document.createElement('div');
        bpmValue.className = 'slider-value';
        bpmValue.id = 'bpm-value';
        bpmValue.textContent = '120 BPM';
        
        bpmSlider.addEventListener('input', () => {
            bpmValue.textContent = `${bpmSlider.value} BPM`;
            if (this.livePreviewToggle && this.livePreviewToggle.checked) {
                clearTimeout(this.livePreviewTimeout);
                this.livePreviewTimeout = setTimeout(() => {
                    this.isLivePreview = true;
                    this.generatePrompt();
                }, 300);
            }
        });
        
        bpmContainer.appendChild(bpmSlider);
        bpmContainer.appendChild(bpmValue);
        bpmGroup.appendChild(bpmLabel);
        bpmGroup.appendChild(bpmContainer);
        content.appendChild(bpmGroup);
        
        // Key Select
        const keyGroup = document.createElement('div');
        keyGroup.className = 'form-group';
        const keyLabel = document.createElement('label');
        keyLabel.textContent = 'Key';
        keyLabel.setAttribute('for', 'key-select');
        const keySelect = document.createElement('select');
        keySelect.id = 'key-select';
        keySelect.name = 'key-select';
        
        const defaultKey = document.createElement('option');
        defaultKey.value = '';
        defaultKey.textContent = 'Select Key...';
        keySelect.appendChild(defaultKey);
        
        const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const scales = ['Major', 'Minor'];
        
        keys.forEach(key => {
            scales.forEach(scale => {
                const opt = document.createElement('option');
                opt.value = `${key} ${scale}`;
                opt.textContent = `${key} ${scale}`;
                keySelect.appendChild(opt);
            });
        });
        
        keyGroup.appendChild(keyLabel);
        keyGroup.appendChild(keySelect);
        content.appendChild(keyGroup);
        
        // Tempo Preset Select (optional)
        const tempoPresetGroup = document.createElement('div');
        tempoPresetGroup.className = 'form-group';
        const tempoPresetLabel = document.createElement('label');
        tempoPresetLabel.textContent = 'Tempo Preset';
        tempoPresetLabel.setAttribute('for', 'tempo');
        const tempoSelect = document.createElement('select');
        tempoSelect.id = 'tempo';
        tempoSelect.name = 'tempo';
        
        const defaultTempo = document.createElement('option');
        defaultTempo.value = '';
        defaultTempo.textContent = 'Select Tempo Preset...';
        tempoSelect.appendChild(defaultTempo);
        
        (this.data.instruments?.tempo || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            tempoSelect.appendChild(opt);
        });
        
        tempoPresetGroup.appendChild(tempoPresetLabel);
        tempoPresetGroup.appendChild(tempoSelect);
        content.appendChild(tempoPresetGroup);
        
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
        
        section.appendChild(header);
        section.appendChild(content);
        this.formSections.appendChild(section);
        
        // Apply saved preferences
        this.applySectionPreferences(section, 'Tempo & Key');
    }

    createWorldMusicSection() {
        const section = document.createElement('div');
        section.className = 'form-section';
        section.dataset.sectionTitle = 'World Music';
        
        const header = document.createElement('div');
        header.className = 'form-section-header';
        
        const headerLeft = document.createElement('div');
        headerLeft.className = 'section-header-left';
        headerLeft.innerHTML = `<h3>World Music</h3>`;
        
        const headerRight = document.createElement('div');
        headerRight.className = 'section-header-right';
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'section-action-btn pin-btn';
        pinBtn.title = 'Pin section to top';
        pinBtn.innerHTML = '📌';
        pinBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePinSection('World Music');
        });
        
        const hideBtn = document.createElement('button');
        hideBtn.className = 'section-action-btn hide-btn';
        hideBtn.title = 'Hide section';
        hideBtn.innerHTML = '👁️';
        hideBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleHideSection('World Music');
        });
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.textContent = '▼';
        
        headerRight.appendChild(pinBtn);
        headerRight.appendChild(hideBtn);
        headerRight.appendChild(toggleIcon);
        
        header.appendChild(headerLeft);
        header.appendChild(headerRight);
        
        const content = document.createElement('div');
        content.className = 'form-section-content';
        
        // Region Select
        const regionGroup = document.createElement('div');
        regionGroup.className = 'form-group';
        const regionLabel = document.createElement('label');
        regionLabel.textContent = 'Region';
        regionLabel.setAttribute('for', 'world_region');
        const regionSelect = document.createElement('select');
        regionSelect.id = 'world_region';
        regionSelect.name = 'world_region';
        
        const defaultRegion = document.createElement('option');
        defaultRegion.value = '';
        defaultRegion.textContent = 'Select Region...';
        regionSelect.appendChild(defaultRegion);
        
        (this.data.worldMusic || []).forEach(region => {
            const opt = document.createElement('option');
            opt.value = region.region;
            opt.textContent = region.region;
            regionSelect.appendChild(opt);
        });
        
        regionGroup.appendChild(regionLabel);
        regionGroup.appendChild(regionSelect);
        content.appendChild(regionGroup);
        
        // Tradition Select
        const traditionGroup = document.createElement('div');
        traditionGroup.className = 'form-group';
        const traditionLabel = document.createElement('label');
        traditionLabel.textContent = 'Tradition';
        traditionLabel.setAttribute('for', 'world_tradition');
        const traditionSelect = document.createElement('select');
        traditionSelect.id = 'world_tradition';
        traditionSelect.name = 'world_tradition';
        
        const defaultTradition = document.createElement('option');
        defaultTradition.value = '';
        defaultTradition.textContent = 'Select Tradition...';
        traditionSelect.appendChild(defaultTradition);
        
        traditionGroup.appendChild(traditionLabel);
        traditionGroup.appendChild(traditionSelect);
        content.appendChild(traditionGroup);
        
        // Instruments Select
        const instrumentsGroup = document.createElement('div');
        instrumentsGroup.className = 'form-group';
        const instrumentsLabel = document.createElement('label');
        instrumentsLabel.textContent = 'Instruments';
        instrumentsLabel.setAttribute('for', 'world_instruments');
        const instrumentsSelect = document.createElement('select');
        instrumentsSelect.id = 'world_instruments';
        instrumentsSelect.name = 'world_instruments';
        
        const defaultInstruments = document.createElement('option');
        defaultInstruments.value = '';
        defaultInstruments.textContent = 'Select Instruments...';
        instrumentsSelect.appendChild(defaultInstruments);
        
        instrumentsGroup.appendChild(instrumentsLabel);
        instrumentsGroup.appendChild(instrumentsSelect);
        content.appendChild(instrumentsGroup);
        
        // World Music Details
        const details = this.data.worldMusicDetails || {};
        
        // Rhythmic Feel
        const rhythmicGroup = document.createElement('div');
        rhythmicGroup.className = 'form-group';
        const rhythmicLabel = document.createElement('label');
        rhythmicLabel.textContent = 'Rhythmic Feel';
        rhythmicLabel.setAttribute('for', 'world_rhythmic_feel');
        const rhythmicSelect = document.createElement('select');
        rhythmicSelect.id = 'world_rhythmic_feel';
        rhythmicSelect.name = 'world_rhythmic_feel';
        const defaultRhythmic = document.createElement('option');
        defaultRhythmic.value = '';
        defaultRhythmic.textContent = 'Select Rhythmic Feel...';
        rhythmicSelect.appendChild(defaultRhythmic);
        (details.rhythmic_feel || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            rhythmicSelect.appendChild(opt);
        });
        rhythmicGroup.appendChild(rhythmicLabel);
        rhythmicGroup.appendChild(rhythmicSelect);
        content.appendChild(rhythmicGroup);
        
        // Scale / Mode
        const scaleGroup = document.createElement('div');
        scaleGroup.className = 'form-group';
        const scaleLabel = document.createElement('label');
        scaleLabel.textContent = 'Scale / Mode';
        scaleLabel.setAttribute('for', 'world_scale_mode');
        const scaleSelect = document.createElement('select');
        scaleSelect.id = 'world_scale_mode';
        scaleSelect.name = 'world_scale_mode';
        const defaultScale = document.createElement('option');
        defaultScale.value = '';
        defaultScale.textContent = 'Select Scale / Mode...';
        scaleSelect.appendChild(defaultScale);
        (details.scale_mode || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            scaleSelect.appendChild(opt);
        });
        scaleGroup.appendChild(scaleLabel);
        scaleGroup.appendChild(scaleSelect);
        content.appendChild(scaleGroup);
        
        // Musical Texture
        const textureGroup = document.createElement('div');
        textureGroup.className = 'form-group';
        const textureLabel = document.createElement('label');
        textureLabel.textContent = 'Musical Texture';
        textureLabel.setAttribute('for', 'world_musical_texture');
        const textureSelect = document.createElement('select');
        textureSelect.id = 'world_musical_texture';
        textureSelect.name = 'world_musical_texture';
        const defaultTexture = document.createElement('option');
        defaultTexture.value = '';
        defaultTexture.textContent = 'Select Musical Texture...';
        textureSelect.appendChild(defaultTexture);
        (details.musical_texture || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            textureSelect.appendChild(opt);
        });
        textureGroup.appendChild(textureLabel);
        textureGroup.appendChild(textureSelect);
        content.appendChild(textureGroup);
        
        // Performance Context
        const contextGroup = document.createElement('div');
        contextGroup.className = 'form-group';
        const contextLabel = document.createElement('label');
        contextLabel.textContent = 'Performance Context';
        contextLabel.setAttribute('for', 'world_performance_context');
        const contextSelect = document.createElement('select');
        contextSelect.id = 'world_performance_context';
        contextSelect.name = 'world_performance_context';
        const defaultContext = document.createElement('option');
        defaultContext.value = '';
        defaultContext.textContent = 'Select Performance Context...';
        contextSelect.appendChild(defaultContext);
        (details.performance_context || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            contextSelect.appendChild(opt);
        });
        contextGroup.appendChild(contextLabel);
        contextGroup.appendChild(contextSelect);
        content.appendChild(contextGroup);
        
        // World Vocal Style
        const worldVocalGroup = document.createElement('div');
        worldVocalGroup.className = 'form-group';
        const worldVocalLabel = document.createElement('label');
        worldVocalLabel.textContent = 'Vocal Style';
        worldVocalLabel.setAttribute('for', 'world_vocal_style');
        const worldVocalSelect = document.createElement('select');
        worldVocalSelect.id = 'world_vocal_style';
        worldVocalSelect.name = 'world_vocal_style';
        const defaultWorldVocal = document.createElement('option');
        defaultWorldVocal.value = '';
        defaultWorldVocal.textContent = 'Select Vocal Style...';
        worldVocalSelect.appendChild(defaultWorldVocal);
        (details.world_vocal_style || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            worldVocalSelect.appendChild(opt);
        });
        worldVocalGroup.appendChild(worldVocalLabel);
        worldVocalGroup.appendChild(worldVocalSelect);
        content.appendChild(worldVocalGroup);
        
        // Atmosphere
        const atmosphereGroup = document.createElement('div');
        atmosphereGroup.className = 'form-group';
        const atmosphereLabel = document.createElement('label');
        atmosphereLabel.textContent = 'Atmosphere';
        atmosphereLabel.setAttribute('for', 'world_atmosphere');
        const atmosphereSelect = document.createElement('select');
        atmosphereSelect.id = 'world_atmosphere';
        atmosphereSelect.name = 'world_atmosphere';
        const defaultAtmosphere = document.createElement('option');
        defaultAtmosphere.value = '';
        defaultAtmosphere.textContent = 'Select Atmosphere...';
        atmosphereSelect.appendChild(defaultAtmosphere);
        (details.atmosphere || []).forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            atmosphereSelect.appendChild(opt);
        });
        atmosphereGroup.appendChild(atmosphereLabel);
        atmosphereGroup.appendChild(atmosphereSelect);
        content.appendChild(atmosphereGroup);
        
        // Update tradition and instruments when region changes
        regionSelect.addEventListener('change', () => {
            const selectedRegion = (this.data.worldMusic || []).find(r => r.region === regionSelect.value);
            
            // Clear and populate traditions
            traditionSelect.innerHTML = '';
            const newDefaultTradition = document.createElement('option');
            newDefaultTradition.value = '';
            newDefaultTradition.textContent = 'Select Tradition...';
            traditionSelect.appendChild(newDefaultTradition);
            
            // Clear instruments
            instrumentsSelect.innerHTML = '';
            const newDefaultInstruments = document.createElement('option');
            newDefaultInstruments.value = '';
            newDefaultInstruments.textContent = 'Select Instruments...';
            instrumentsSelect.appendChild(newDefaultInstruments);
            
            if (selectedRegion && selectedRegion.traditions && Array.isArray(selectedRegion.traditions)) {
                selectedRegion.traditions.forEach(tradition => {
                    const opt = document.createElement('option');
                    opt.value = tradition;
                    opt.textContent = tradition;
                    traditionSelect.appendChild(opt);
                });
            }
        });
        
        traditionSelect.addEventListener('change', () => {
            const selectedRegion = (this.data.worldMusic || []).find(r => r.region === regionSelect.value);
            
            // Clear and populate instruments
            instrumentsSelect.innerHTML = '';
            const newDefaultInstruments = document.createElement('option');
            newDefaultInstruments.value = '';
            newDefaultInstruments.textContent = 'Select Instruments...';
            instrumentsSelect.appendChild(newDefaultInstruments);
            
            if (selectedRegion && selectedRegion.instruments && Array.isArray(selectedRegion.instruments)) {
                selectedRegion.instruments.forEach(instrument => {
                    const opt = document.createElement('option');
                    opt.value = instrument;
                    opt.textContent = instrument;
                    instrumentsSelect.appendChild(opt);
                });
            }
        });
        
        header.addEventListener('click', () => {
            header.classList.toggle('collapsed');
            content.classList.toggle('collapsed');
        });
        
        section.appendChild(header);
        section.appendChild(content);
        this.formSections.appendChild(section);
        
        // Apply saved preferences
        this.applySectionPreferences(section, 'World Music');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePrompt());
        this.randomBtn.addEventListener('click', () => this.generateRandomPrompt());
        this.copyBtn.addEventListener('click', () => this.copyBothPrompts());
        const copyMusicBtn = document.getElementById('copy-music-btn');
        const copyLyricsBtn = document.getElementById('copy-lyrics-btn');
        if (copyMusicBtn) {
            copyMusicBtn.addEventListener('click', () => this.copyMusicPrompt());
        }
        if (copyLyricsBtn) {
            copyLyricsBtn.addEventListener('click', () => this.copyLyricsPrompt());
        }
        this.saveBtn.addEventListener('click', () => this.savePrompt());
        this.optimizeBtn.addEventListener('click', () => this.optimizePrompt());
        this.resetBtn.addEventListener('click', () => this.resetForm());
        this.promptOutput.addEventListener('input', () => this.updateCharacterCounter());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.closeAnalysisModal.addEventListener('click', () => this.closeModal());
        this.cancelAnalysisBtn.addEventListener('click', () => this.closeModal());
        this.applyOptimizationBtn.addEventListener('click', () => this.applyOptimization());
        
        // Close modal when clicking outside
        this.analysisModal.addEventListener('click', (e) => {
            if (e.target === this.analysisModal) {
                this.closeModal();
            }
        });
        this.exportBtn.addEventListener('click', () => this.toggleExportDropdown());
        this.exportJsonBtn.addEventListener('click', () => this.exportAsJSON());
        this.exportTxtBtn.addEventListener('click', () => this.exportAsText());
        this.importBtn.addEventListener('click', () => this.importFile());
        this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
        
        if (this.savePresetBtn) {
            this.savePresetBtn.addEventListener('click', () => this.savePreset());
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.exportBtn.contains(e.target) && !this.exportDropdown.contains(e.target)) {
                this.exportDropdown.classList.remove('active');
            }
        });

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1); // Remove #
                
                if (target === 'settings') {
                    document.getElementById('settings').scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (target === 'output') {
                    document.getElementById('output').scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (target === 'right-panel') {
                    document.getElementById('right-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                document.getElementById(`${targetTab}-content`).classList.add('active');
            });
        });
    }

    setupLivePreview() {
        // Add change listeners to all selects
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                if (this.livePreviewToggle && this.livePreviewToggle.checked) {
                    // Debounce: wait 300ms after last change
                    clearTimeout(this.livePreviewTimeout);
                    this.livePreviewTimeout = setTimeout(() => {
                        this.isLivePreview = true;
                        this.generatePrompt();
                    }, 300);
                }
            });
        });
        
        // Add input listener to BPM slider
        const bpmSlider = document.getElementById('bpm-slider');
        if (bpmSlider) {
            bpmSlider.addEventListener('input', () => {
                if (this.livePreviewToggle && this.livePreviewToggle.checked) {
                    clearTimeout(this.livePreviewTimeout);
                    this.livePreviewTimeout = setTimeout(() => {
                        this.isLivePreview = true;
                        this.generatePrompt();
                    }, 300);
                }
            });
        }
    }

    setupLyricPreviewWatchers() {
        if (!this.lyricDraftOutput) {
            return;
        }
        const lyricFields = [
            'lyric_theme',
            'lyric_emotion',
            'lyric_story_arc',
            'lyric_perspective',
            'lyric_tense',
            'lyric_rhyme',
            'lyric_language',
            'lyric_structure',
            'lyric_keywords',
            'lyric_custom_text'
        ];
        const handleUpdate = () => {
            clearTimeout(this.lyricPreviewTimeout);
            this.lyricPreviewTimeout = setTimeout(() => this.updateLyricDraftPreview(), 150);
        };
        lyricFields.forEach(fieldId => {
            const el = document.getElementById(fieldId);
            if (!el) return;
            const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(eventName, handleUpdate);
        });
        this.updateLyricDraftPreview();
    }

    updateLyricDraftPreview() {
        if (!this.lyricDraftOutput) return;
        const values = this.getFormValues();
        const draft = this.generateLyricDraft(values);
        if (!draft) {
            this.lyricDraftOutput.textContent = 'Select lyric options to preview a draft snippet.';
            this.currentLyricDraft = '';
            return;
        }
        this.currentLyricDraft = draft;
        this.lyricDraftOutput.textContent = draft;
    }

    getFormValues() {
        const values = {};
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            if (select.value) {
                values[select.id] = select.value;
            }
        });
        
        const textInputs = document.querySelectorAll('input[data-field-type="text"], textarea[data-field-type="text"]');
        textInputs.forEach(input => {
            if (input.value && input.value.trim() !== '') {
                values[input.id] = input.value.trim();
            }
        });
        
        // Get BPM slider value
        const bpmSlider = document.getElementById('bpm-slider');
        if (bpmSlider) {
            values.bpm = bpmSlider.value;
        }
        
        return values;
    }

    generatePrompt() {
        const values = this.getFormValues();
        const parts = [];

        // Genre & Sub-Genre
        if (values.genre) {
            parts.push(values.genre);
        }
        if (values.subgenre) {
            parts.push(values.subgenre);
        }

        // Origin / Language
        if (values.origin_language) {
            parts.push(`${values.origin_language} language`);
        }

        // Turkish Music Styles
        if (values.turkish_music_style) {
            parts.push(values.turkish_music_style);
        }

        // Turkish Makam
        if (values.makam) {
            parts.push(`Turkish ${values.makam} makam style`);
        }

        // World Music
        if (values.world_region) {
            let worldPart = values.world_region;
            if (values.world_tradition) {
                worldPart += ` ${values.world_tradition}`;
            }
            if (values.world_instruments) {
                worldPart += ` with ${values.world_instruments}`;
            }
            
            // World Music Details
            if (values.world_rhythmic_feel) {
                worldPart += `, ${values.world_rhythmic_feel}`;
            }
            if (values.world_scale_mode) {
                worldPart += `, ${values.world_scale_mode}`;
            }
            if (values.world_musical_texture) {
                worldPart += `, ${values.world_musical_texture}`;
            }
            if (values.world_performance_context) {
                worldPart += `, ${values.world_performance_context}`;
            }
            if (values.world_vocal_style) {
                worldPart += `, ${values.world_vocal_style}`;
            }
            if (values.world_atmosphere) {
                worldPart += `, ${values.world_atmosphere}`;
            }
            
            parts.push(worldPart);
        }

        // BPM
        if (values.bpm && values.bpm !== '120') {
            parts.push(`${values.bpm} BPM`);
        }
        
        // Tempo Preset (if selected)
        if (values.tempo) {
            parts.push(values.tempo);
        }
        
        // Key
        if (values['key-select']) {
            parts.push(`in ${values['key-select']}`);
        }

        // Mood
        if (values.mood) {
            parts.push(`${values.mood} mood`);
        }

        // Harmony
        if (values.harmony) {
            parts.push(`${values.harmony} harmony`);
        }

        // Rhythm & Percussion
        if (values.rhythm) {
            parts.push(`${values.rhythm} rhythm`);
        }
        if (values.percussion) {
            parts.push(`${values.percussion}`);
        }

        // Bass
        if (values.bass) {
            parts.push(`${values.bass}`);
        }

        // Lead Instrument
        if (values.lead) {
            parts.push(`featuring ${values.lead}`);
        }

        // Accompaniment
        if (values.accompaniment && values.accompaniment !== 'None') {
            parts.push(`with ${values.accompaniment}`);
        }

        // Vocals
        if (values.vocal_type && values.vocal_type !== 'No Vocals' && values.vocal_type !== 'Instrumental Focus') {
            let vocalPart = values.vocal_type;
            if (values.vocal_range) {
                vocalPart += `, ${values.vocal_range}`;
            }
            if (values.vocal_style) {
                vocalPart += `, ${values.vocal_style} style`;
            }
            if (values.vocal_timbre) {
                vocalPart += `, ${values.vocal_timbre} timbre`;
            }
            if (values.vocal_effects && values.vocal_effects !== 'No Effects' && values.vocal_effects !== 'Natural') {
                vocalPart += `, ${values.vocal_effects}`;
            }
            parts.push(vocalPart);
        }

        // Structure & Dynamic Flow
        if (values.structure_flow) {
            parts.push(values.structure_flow);
        }

        // Production
        if (values.mixing_style) {
            parts.push(`${values.mixing_style} mixing`);
        }
        if (values.production_style) {
            parts.push(`${values.production_style} production`);
        }

        // Join music parts with commas and clean up
        let musicPrompt = parts.join(', ');
        musicPrompt = musicPrompt.replace(/, ,/g, ',');
        musicPrompt = musicPrompt.replace(/\s+/g, ' ');
        musicPrompt = musicPrompt.trim();

        // Lyrics prompt (separate)
        const lyricDetails = [];
        if (values.lyric_theme) {
            lyricDetails.push(`theme: ${values.lyric_theme}`);
        }
        if (values.lyric_emotion) {
            lyricDetails.push(`${values.lyric_emotion} emotion`);
        }
        if (values.lyric_story_arc) {
            lyricDetails.push(values.lyric_story_arc);
        }
        if (values.lyric_perspective) {
            lyricDetails.push(`${values.lyric_perspective} perspective`);
        }
        if (values.lyric_tense) {
            lyricDetails.push(values.lyric_tense);
        }
        if (values.lyric_rhyme) {
            lyricDetails.push(`rhyme scheme: ${values.lyric_rhyme}`);
        }
        if (values.lyric_language) {
            lyricDetails.push(`lyrics in ${values.lyric_language}`);
        }
        if (values.lyric_structure) {
            lyricDetails.push(values.lyric_structure);
        }
        if (values.lyric_keywords) {
            lyricDetails.push(`keywords: ${values.lyric_keywords}`);
        }
        if (values.lyric_custom_text) {
            lyricDetails.push(`custom snippet: "${values.lyric_custom_text}"`);
        }
        
        let lyricsPrompt = '';
        if (lyricDetails.length > 0) {
            lyricsPrompt = lyricDetails.join('; ');
            lyricsPrompt = lyricsPrompt.replace(/\s+/g, ' ').trim();
        }

        // Update both textareas
        this.promptMusic.value = musicPrompt;
        this.promptLyrics.value = lyricsPrompt;
        
        // Legacy combined output (for backward compatibility)
        const combinedPrompt = lyricsPrompt 
            ? `${musicPrompt}, Lyrics guidance -> ${lyricsPrompt}`
            : musicPrompt;
        this.promptOutput.value = combinedPrompt;
        
        this.updateCharacterCounter();
        
        // Auto-save to history when prompt is generated (only if not from live preview)
        // We'll skip auto-save for live preview to avoid cluttering history
        if (combinedPrompt.trim() && !this.isLivePreview) {
            this.autoSaveToHistory(combinedPrompt);
        }
        this.isLivePreview = false;
    }
    applyLyricPreset(preset) {
        if (!preset?.values) return;
        const values = preset.values;
        Object.entries(values).forEach(([field, value]) => {
            if (!value && value !== '') return;
            const select = document.getElementById(field);
            if (select && select.tagName === 'SELECT') {
                const optionExists = Array.from(select.options).some(opt => opt.value === value);
                if (!optionExists && value) {
                    const opt = document.createElement('option');
                    opt.value = value;
                    opt.textContent = value;
                    select.appendChild(opt);
                }
                select.value = value;
                select.dispatchEvent(new Event('change'));
            } else {
                const input = document.getElementById(field);
                if (input) {
                    input.value = value;
                }
            }
        });
        this.generatePrompt();
        this.copyLyricSummary();
        this.updateLyricDraftPreview();
    }

    buildLyricSummary(values) {
        const parts = [];
        const push = (text) => {
            if (text) {
                parts.push(text);
            }
        };
        push(values.lyric_theme);
        push(values.lyric_emotion);
        push(values.lyric_story_arc);
        if (values.lyric_perspective) {
            push(`${values.lyric_perspective} perspective`);
        }
        push(values.lyric_tense);
        if (values.lyric_rhyme) {
            push(`rhyme ${values.lyric_rhyme}`);
        }
        if (values.lyric_language) {
            push(`lyrics in ${values.lyric_language}`);
        }
        push(values.lyric_structure);
        if (values.lyric_keywords) {
            push(`keywords: ${values.lyric_keywords}`);
        }
        if (values.lyric_custom_text) {
            push(`snippet: ${values.lyric_custom_text}`);
        }
        if (!parts.length) {
            return '';
        }
        let summary = parts.join('; ');
        const limit = 200;
        if (summary.length > limit) {
            summary = summary.slice(0, limit - 3).trimEnd() + '...';
        }
        return summary;
    }

    async copyLyricSummary() {
        const values = this.getFormValues();
        const summary = this.buildLyricSummary(values);
        if (!summary) {
            alert('Please select lyric options or enter custom text first.');
            return;
        }
        try {
            await navigator.clipboard.writeText(summary);
        } catch (error) {
            const helper = document.createElement('textarea');
            helper.value = summary;
            helper.style.position = 'fixed';
            helper.style.opacity = '0';
            document.body.appendChild(helper);
            helper.focus();
            helper.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                alert('Copy failed. Please copy manually:\n' + summary);
                document.body.removeChild(helper);
                return;
            }
            document.body.removeChild(helper);
        }
        this.showTemporaryStatus(this.lyricSummaryBtn, 'Copied!');
    }

    showTemporaryStatus(button, message) {
        if (!button) return;
        const originalText = button.textContent;
        button.textContent = message;
        button.disabled = true;
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1600);
    }

    generateLyricDraft(values) {
        const hasInput = [
            'lyric_theme',
            'lyric_emotion',
            'lyric_story_arc',
            'lyric_perspective',
            'lyric_keywords',
            'lyric_custom_text'
        ].some(field => values[field]);
        if (!hasInput) {
            return '';
        }
        const voice = this.getLyricVoice(values.lyric_perspective);
        const emotion = (values.lyric_emotion || 'restless').toLowerCase();
        const theme = values.lyric_theme || 'electric dream';
        const structure = values.lyric_structure ? values.lyric_structure.split('(')[0].trim() : 'Verse / Chorus loop';
        const tense = values.lyric_tense ? values.lyric_tense.toLowerCase() : 'present tense';
        const storyArc = values.lyric_story_arc || 'Verse = problem, Chorus = breakthrough';
        const languageTag = values.lyric_language ? ` in ${values.lyric_language}` : '';
        const keywords = this.extractLyricKeywords(values.lyric_keywords);
        const imagery = keywords[0] || this.pickRandom([
            'neon alleys',
            'storm-lit rooftops',
            'desert highways',
            'midnight subways',
            'old vinyl basements',
            'hidden after-hours bars'
        ]);
        const texture = keywords[1] || this.pickRandom([
            'humming wires',
            'paper-thin walls',
            'electric static',
            'silver fog',
            'mirrorball dust'
        ]);
        const signal = keywords[2] || this.pickRandom([
            'broken radio prayers',
            'looping voicemail ghosts',
            'cheap motel confessions',
            'cathedral reverb',
            'echoes of a distant crowd'
        ]);

        const openingLines = [
            `${voice.pronounCapital} chase ${emotion} echoes through ${imagery}`,
            `${voice.pronounCapital} hold ${voice.possessive} breath inside ${imagery}`,
            `${voice.pronounCapital} stitch ${voice.possessive} pulse to ${texture}`,
            `${voice.pronounCapital} confess ${voice.possessive} secrets under ${imagery}`
        ];

        const middleLines = [
            `${voice.pronoun} trade names with ${signal}`,
            `${voice.pronoun} keep ${voice.possessive} promises sealed in ${texture}`,
            `${voice.pronoun} rewrite ${theme.toLowerCase()} across ${imagery}`,
            `${voice.pronoun} drift between ${structure.toLowerCase()} ghosts`
        ];

        const arcLines = [
            `${this.capitalize(storyArc.split(',')[0])} pulls ${voice.object} forward`,
            `${structure} keeps ${voice.object} awake`,
            `${this.capitalize(emotion)} tides drown ${voice.object} in light`,
            `${voice.pronounCapital} learn to breathe ${texture} again`
        ];

        const line1 = this.pickRandom(openingLines);
        const line2 = `In ${tense}${languageTag}, ${this.pickRandom(middleLines)}.`;
        let line3 = values.lyric_custom_text && values.lyric_custom_text.trim() 
            ? values.lyric_custom_text.trim()
            : this.pickRandom(arcLines);

        const draft = `${line1}.\n${line2}\n${line3}`;
        return draft;
    }

    copyLyricDraft() {
        if (!this.currentLyricDraft) {
            alert('Generate a lyric draft first.');
            return;
        }
        const text = this.currentLyricDraft;
        const fallback = () => {
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand('copy');
            } catch (error) {
                alert('Copy failed. Please copy manually:\n' + text);
                document.body.removeChild(temp);
                return;
            }
            document.body.removeChild(temp);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showTemporaryStatus(this.lyricDraftCopyBtn, 'Copied!');
            }).catch(() => {
                fallback();
                this.showTemporaryStatus(this.lyricDraftCopyBtn, 'Copied!');
            });
        } else {
            fallback();
            this.showTemporaryStatus(this.lyricDraftCopyBtn, 'Copied!');
        }
    }

    getLyricVoice(perspective) {
        const voices = {
            'First person': { pronoun: 'i', pronounCapital: 'I', possessive: 'my', object: 'me' },
            'Second person': { pronoun: 'you', pronounCapital: 'You', possessive: 'your', object: 'you' },
            'Third person': { pronoun: 'they', pronounCapital: 'They', possessive: 'their', object: 'them' },
            'Group/collective voice': { pronoun: 'we', pronounCapital: 'We', possessive: 'our', object: 'us' },
            'Unreliable narrator': { pronoun: 'i', pronounCapital: 'I', possessive: 'my', object: 'me' },
            'Omniscient narrator': { pronoun: 'they', pronounCapital: 'They', possessive: 'their', object: 'them' }
        };
        return voices[perspective] || { pronoun: 'i', pronounCapital: 'I', possessive: 'my', object: 'me' };
    }

    extractLyricKeywords(keywordString) {
        if (!keywordString) return [];
        return keywordString
            .split(',')
            .map(part => part.trim())
            .filter(Boolean)
            .slice(0, 3);
    }

    pickRandom(array) {
        if (!array || array.length === 0) return '';
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    generateRandomPrompt() {
        // Reset form first
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });
        const textFields = document.querySelectorAll('input[data-field-type="text"], textarea[data-field-type="text"]');
        textFields.forEach(field => {
            field.value = '';
        });

        // Random selections - pick 3-7 random categories
        const categories = [
            { id: 'genre', options: this.data.genres || [] },
            { id: 'subgenre', options: this.data.subgenres || [] },
            { id: 'makam', options: this.data.makam || [] },
            { id: 'tempo', options: this.data.instruments?.tempo || [] },
            { id: 'mood', options: this.data.instruments?.mood || [] },
            { id: 'harmony', options: this.data.instruments?.harmony || [] },
            { id: 'rhythm', options: this.data.instruments?.rhythm || [] },
            { id: 'percussion', options: this.data.instruments?.percussion || [] },
            { id: 'bass', options: this.data.instruments?.bass || [] },
            { id: 'lead', options: this.data.instruments?.lead || [] },
            { id: 'accompaniment', options: this.data.instruments?.accompaniment || [] },
            { id: 'vocal_type', options: this.data.vocals?.vocal_type || [] },
            { id: 'vocal_style', options: this.data.vocals?.vocal_style || [] },
            { id: 'mixing_style', options: this.data.production?.mixing_style || [] },
            { id: 'production_style', options: this.data.production?.production_style || [] }
        ];

        // Filter out empty categories
        const validCategories = categories.filter(cat => cat.options && cat.options.length > 0);
        
        // Randomly select 4-8 categories
        const numSelections = Math.floor(Math.random() * 5) + 4; // 4-8 selections
        const shuffled = [...validCategories].sort(() => Math.random() - 0.5);
        const selectedCategories = shuffled.slice(0, numSelections);

        // Apply random selections to form
        selectedCategories.forEach(category => {
            const select = document.getElementById(category.id);
            if (select && category.options.length > 0) {
                // Skip "None" options for certain fields
                const validOptions = category.options.filter(opt => 
                    !['None', 'No Vocals', 'Instrumental Focus', 'No Effects', 'Natural'].includes(opt)
                );
                
                if (validOptions.length > 0) {
                    const randomOption = validOptions[Math.floor(Math.random() * validOptions.length)];
                    const optionIndex = Array.from(select.options).findIndex(opt => opt.value === randomOption);
                    if (optionIndex > 0) {
                        select.selectedIndex = optionIndex;
                    }
                }
            }
        });

        // Random world music selection (30% chance)
        if (Math.random() < 0.3 && this.data.worldMusic && this.data.worldMusic.length > 0) {
            const randomRegion = this.data.worldMusic[Math.floor(Math.random() * this.data.worldMusic.length)];
            const regionSelect = document.getElementById('world_region');
            if (regionSelect) {
                const regionIndex = Array.from(regionSelect.options).findIndex(opt => opt.value === randomRegion.region);
                if (regionIndex > 0) {
                    regionSelect.selectedIndex = regionIndex;
                    regionSelect.dispatchEvent(new Event('change')); // Trigger update
                    
                    // Wait a bit for tradition/instruments to populate, then select random
                    setTimeout(() => {
                        if (randomRegion.traditions && randomRegion.traditions.length > 0) {
                            const randomTradition = randomRegion.traditions[Math.floor(Math.random() * randomRegion.traditions.length)];
                            const traditionSelect = document.getElementById('world_tradition');
                            if (traditionSelect) {
                                const tradIndex = Array.from(traditionSelect.options).findIndex(opt => opt.value === randomTradition);
                                if (tradIndex > 0) {
                                    traditionSelect.selectedIndex = tradIndex;
                                    traditionSelect.dispatchEvent(new Event('change'));
                                    
                                    // Select random instrument
                                    setTimeout(() => {
                                        if (randomRegion.instruments && randomRegion.instruments.length > 0) {
                                            const randomInstrument = randomRegion.instruments[Math.floor(Math.random() * randomRegion.instruments.length)];
                                            const instSelect = document.getElementById('world_instruments');
                                            if (instSelect) {
                                                const instIndex = Array.from(instSelect.options).findIndex(opt => opt.value === randomInstrument);
                                                if (instIndex > 0) {
                                                    instSelect.selectedIndex = instIndex;
                                                }
                                            }
                                        }
                                    }, 100);
                                }
                            }
                        }
                    }, 100);
                }
            }
        }

        // Generate prompt after a short delay to allow world music to populate
        setTimeout(() => {
            this.generatePrompt();
            this.updateLyricDraftPreview();
            
            // Visual feedback
            const originalText = this.randomBtn.innerHTML;
            this.randomBtn.innerHTML = '<span class="dice-icon">✨</span> Generated!';
            this.randomBtn.style.background = '#34C759';
            this.randomBtn.style.color = '#FFFFFF';
            
            setTimeout(() => {
                this.randomBtn.innerHTML = originalText;
                this.randomBtn.style.background = '';
                this.randomBtn.style.color = '';
            }, 2000);
        }, 300);
    }

    optimizePrompt() {
        let originalPrompt = this.promptOutput.value;
        if (!originalPrompt) {
            alert('Please generate a prompt first.');
            return;
        }

        // Analyze original prompt
        const analysis = this.analyzePrompt(originalPrompt);
        
        // Generate optimized version
        let optimized = this.performOptimization(originalPrompt);
        this.optimizedPrompt = optimized;

        // Show analysis modal
        this.showAnalysis(analysis, originalPrompt, optimized);
    }

    analyzePrompt(prompt) {
        const words = prompt.split(/\s+/);
        const chars = prompt.length;
        const commas = (prompt.match(/,/g) || []).length;
        const fillerWords = (prompt.match(/\b(with a|with the|that is|which is|and the|of the|in the|on the|at the)\b/gi) || []).length;
        const redundantAdjectives = (prompt.match(/\b(very|quite|rather|somewhat|extremely|incredibly)\s+/gi) || []).length;
        const repeatedWords = this.findRepeatedWords(prompt);
        
        const suggestions = [];
        
        if (chars > 1000) {
            suggestions.push('Prompt exceeds 1000 characters. Consider removing less important details.');
        } else if (chars > 900) {
            suggestions.push('Prompt is close to the limit. Consider optimizing for better results.');
        }
        
        if (fillerWords > 0) {
            suggestions.push(`Found ${fillerWords} filler word(s). Removing them will make the prompt more concise.`);
        }
        
        if (redundantAdjectives > 0) {
            suggestions.push(`Found ${redundantAdjectives} redundant adjective(s). Removing them will improve clarity.`);
        }
        
        if (repeatedWords.length > 0) {
            suggestions.push(`Found repeated words: ${repeatedWords.join(', ')}. Consider using synonyms or removing duplicates.`);
        }
        
        if (commas > 15) {
            suggestions.push('Prompt has many commas. Consider grouping related elements together.');
        }
        
        if (words.length < 10) {
            suggestions.push('Prompt is very short. Adding more details might improve results.');
        }

        return {
            originalLength: chars,
            wordCount: words.length,
            commaCount: commas,
            fillerWords: fillerWords,
            redundantAdjectives: redundantAdjectives,
            repeatedWords: repeatedWords,
            suggestions: suggestions,
            status: chars > 1000 ? 'error' : chars > 900 ? 'warning' : 'good'
        };
    }

    findRepeatedWords(prompt) {
        const words = prompt.toLowerCase().split(/\s+/);
        const wordCount = {};
        const repeated = [];
        
        words.forEach(word => {
            const cleanWord = word.replace(/[^\w]/g, '');
            if (cleanWord.length > 3) { // Only check words longer than 3 chars
                wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
            }
        });
        
        Object.keys(wordCount).forEach(word => {
            if (wordCount[word] > 2) {
                repeated.push(word);
            }
        });
        
        return repeated.slice(0, 5); // Return max 5 repeated words
    }

    performOptimization(prompt) {
        let optimized = prompt;

        // Step 1: Remove filler words
        const fillerWords = /\b(with a|with the|that is|which is|and the|of the|in the|on the|at the)\b/gi;
        optimized = optimized.replace(fillerWords, '');

        // Step 2: Shorten long descriptions
        optimized = optimized.replace(/\b(featuring|with|including)\s+/gi, '');
        optimized = optimized.replace(/\bstyle\s+style\b/gi, 'style');
        optimized = optimized.replace(/\bmood\s+mood\b/gi, 'mood');

        // Step 3: Remove redundant adjectives
        optimized = optimized.replace(/\b(very|quite|rather|somewhat|extremely|incredibly)\s+/gi, '');

        // Step 4: Remove duplicate consecutive words
        optimized = optimized.replace(/\b(\w+)(\s+\1\b)+/gi, '$1');

        // Step 5: Compress while keeping meaning
        optimized = optimized.replace(/,\s*,/g, ',');
        optimized = optimized.replace(/\s+/g, ' ');
        optimized = optimized.trim();

        // Step 6: If still too long, truncate intelligently
        if (optimized.length > 1000) {
            let truncated = optimized.substring(0, 997);
            const lastComma = truncated.lastIndexOf(',');
            if (lastComma > 800) {
                truncated = truncated.substring(0, lastComma);
            }
            optimized = truncated + '...';
        }

        return optimized;
    }

    showAnalysis(analysis, original, optimized) {
        const savings = analysis.originalLength - optimized.length;
        const savingsPercent = ((savings / analysis.originalLength) * 100).toFixed(1);

        this.analysisResults.innerHTML = `
            <div class="analysis-section">
                <div class="analysis-section-title">Current Statistics</div>
                <div class="analysis-stat">
                    <span class="analysis-stat-label">Character Count</span>
                    <span class="analysis-stat-value ${analysis.status}">${analysis.originalLength} / 1000</span>
                </div>
                <div class="analysis-stat">
                    <span class="analysis-stat-label">Word Count</span>
                    <span class="analysis-stat-value">${analysis.wordCount} words</span>
                </div>
                <div class="analysis-stat">
                    <span class="analysis-stat-label">Commas</span>
                    <span class="analysis-stat-value">${analysis.commaCount}</span>
                </div>
                <div class="analysis-stat">
                    <span class="analysis-stat-label">Filler Words</span>
                    <span class="analysis-stat-value ${analysis.fillerWords > 0 ? 'warning' : 'good'}">${analysis.fillerWords}</span>
                </div>
                <div class="analysis-stat">
                    <span class="analysis-stat-label">Redundant Adjectives</span>
                    <span class="analysis-stat-value ${analysis.redundantAdjectives > 0 ? 'warning' : 'good'}">${analysis.redundantAdjectives}</span>
                </div>
            </div>

            ${analysis.suggestions.length > 0 ? `
            <div class="analysis-section">
                <div class="analysis-section-title">Suggestions</div>
                <ul class="analysis-suggestions">
                    ${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}
                </ul>
            </div>
            ` : ''}

            <div class="analysis-section">
                <div class="analysis-section-title">Optimized Preview</div>
                <div class="optimization-preview">
                    <div class="optimization-preview-title">
                        Optimized Prompt
                        ${savings > 0 ? `<span class="optimization-savings positive">-${savings} chars (${savingsPercent}%)</span>` : ''}
                    </div>
                    <div class="optimization-preview-text">${this.escapeHtml(optimized)}</div>
                </div>
            </div>
        `;

        this.analysisModal.classList.add('active');
    }

    applyOptimization() {
        if (this.optimizedPrompt) {
            this.promptOutput.value = this.optimizedPrompt;
            this.updateCharacterCounter();
            this.closeModal();
        }
    }

    closeModal() {
        this.analysisModal.classList.remove('active');
    }

    // Export/Import Functions
    toggleExportDropdown() {
        this.exportDropdown.classList.toggle('active');
    }

    exportAsJSON() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        if (!musicPrompt && !lyricsPrompt) {
            alert('No prompt to export. Please generate a prompt first.');
            this.exportDropdown.classList.remove('active');
            return;
        }

        const values = this.getFormValues();
        const exportData = {
            musicPrompt: musicPrompt,
            lyricsPrompt: lyricsPrompt,
            formValues: values,
            timestamp: new Date().toISOString(),
            version: '2.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `suno-prompt-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.exportDropdown.classList.remove('active');
    }

    exportAsText() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        if (!musicPrompt && !lyricsPrompt) {
            alert('No prompt to export. Please generate a prompt first.');
            this.exportDropdown.classList.remove('active');
            return;
        }

        let textContent = '';
        if (musicPrompt) {
            textContent += '=== STYLES ===\n' + musicPrompt + '\n\n';
        }
        if (lyricsPrompt) {
            textContent += '=== LYRICS ===\n' + lyricsPrompt;
        }

        const dataBlob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `suno-prompt-${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.exportDropdown.classList.remove('active');
    }

    importFile() {
        this.importFileInput.click();
    }

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                
                if (file.name.endsWith('.json')) {
                    const data = JSON.parse(content);
                    
                    if (data.formValues) {
                        // Load form values
                        Object.keys(data.formValues).forEach(key => {
                            const select = document.getElementById(key);
                            if (select) {
                                const optionIndex = Array.from(select.options).findIndex(
                                    opt => opt.value === data.formValues[key]
                                );
                                if (optionIndex > 0) {
                                    select.selectedIndex = optionIndex;
                                    if (key.startsWith('world_')) {
                                        select.dispatchEvent(new Event('change'));
                                    }
                                }
                            } else {
                                // Handle text inputs and textareas
                                const input = document.getElementById(key);
                                if (input) {
                                    input.value = data.formValues[key] || '';
                                }
                            }
                        });
                        
                        // Handle BPM slider
                        if (data.formValues.bpm) {
                            const bpmSlider = document.getElementById('bpm-slider');
                            if (bpmSlider) {
                                bpmSlider.value = data.formValues.bpm;
                                const bpmValue = document.getElementById('bpm-value');
                                if (bpmValue) {
                                    bpmValue.textContent = `${data.formValues.bpm} BPM`;
                                }
                            }
                        }
                        
                        // Wait a bit for world music to populate, then generate
                        setTimeout(() => {
                            // New format (v2.0): split prompts
                            if (data.musicPrompt !== undefined || data.lyricsPrompt !== undefined) {
                                this.promptMusic.value = data.musicPrompt || '';
                                this.promptLyrics.value = data.lyricsPrompt || '';
                                // Update legacy combined prompt
                                const combined = data.lyricsPrompt 
                                    ? `${data.musicPrompt || ''}, Lyrics guidance -> ${data.lyricsPrompt}`
                                    : (data.musicPrompt || '');
                                this.promptOutput.value = combined;
                            } else if (data.prompt) {
                                // Legacy format: combined prompt
                                this.promptOutput.value = data.prompt;
                                // Try to split if possible (basic attempt)
                                const parts = data.prompt.split('Lyrics guidance ->');
                                if (parts.length > 1) {
                                    this.promptMusic.value = parts[0].replace(/,\s*$/, '').trim();
                                    this.promptLyrics.value = parts[1].trim();
                                } else {
                                    this.promptMusic.value = data.prompt;
                                    this.promptLyrics.value = '';
                                }
                            } else {
                                this.generatePrompt();
                            }
                            this.updateCharacterCounter();
                            this.updateLyricDraftPreview();
                        }, 300);
                    } else if (data.prompt) {
                        // Legacy: only prompt, no form values
                        this.promptOutput.value = data.prompt;
                        const parts = data.prompt.split('Lyrics guidance ->');
                        if (parts.length > 1) {
                            this.promptMusic.value = parts[0].replace(/,\s*$/, '').trim();
                            this.promptLyrics.value = parts[1].trim();
                        } else {
                            this.promptMusic.value = data.prompt;
                            this.promptLyrics.value = '';
                        }
                        this.updateCharacterCounter();
                    } else if (data.musicPrompt !== undefined || data.lyricsPrompt !== undefined) {
                        // New format: only prompts, no form values
                        this.promptMusic.value = data.musicPrompt || '';
                        this.promptLyrics.value = data.lyricsPrompt || '';
                        this.updateCharacterCounter();
                    }
                } else {
                    // Plain text file - try to parse sections
                    const lines = content.split('\n');
                    let currentSection = null;
                    let musicText = '';
                    let lyricsText = '';
                    
                    lines.forEach(line => {
                        if (line.includes('=== STYLES ===')) {
                            currentSection = 'music';
                        } else if (line.includes('=== LYRICS ===')) {
                            currentSection = 'lyrics';
                        } else if (currentSection === 'music') {
                            musicText += line + '\n';
                        } else if (currentSection === 'lyrics') {
                            lyricsText += line + '\n';
                        } else {
                            // No section header, assume it's all music
                            musicText += line + '\n';
                        }
                    });
                    
                    this.promptMusic.value = musicText.trim();
                    this.promptLyrics.value = lyricsText.trim();
                    this.promptOutput.value = content;
                    this.updateCharacterCounter();
                }
                
                // Visual feedback
                const originalText = this.importBtn.textContent;
                this.importBtn.textContent = 'Imported!';
                this.importBtn.style.background = '#34C759';
                this.importBtn.style.color = '#FFFFFF';
                
                setTimeout(() => {
                    this.importBtn.textContent = originalText;
                    this.importBtn.style.background = '';
                    this.importBtn.style.color = '';
                }, 2000);
            } catch (error) {
                alert('Error importing file. Please check the file format.');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    updateCharacterCounter() {
        // Music prompt counter
        const musicCount = this.promptMusic.value.length;
        this.charCountMusic.textContent = musicCount;
        const musicCounter = this.charCountMusic.parentElement;
        musicCounter.classList.remove('warning', 'error');
        if (musicCount > 1000) {
            musicCounter.classList.add('error');
        } else if (musicCount > 900) {
            musicCounter.classList.add('warning');
        }

        // Lyrics prompt counter
        const lyricsCount = this.promptLyrics.value.length;
        this.charCountLyrics.textContent = lyricsCount;
        const lyricsCounter = this.charCountLyrics.parentElement;
        lyricsCounter.classList.remove('warning', 'error');
        if (lyricsCount > 200) {
            lyricsCounter.classList.add('error');
        } else if (lyricsCount > 180) {
            lyricsCounter.classList.add('warning');
        }

        // Legacy counter (for backward compatibility)
        if (this.charCount) {
            const combinedCount = this.promptOutput.value.length;
            this.charCount.textContent = combinedCount;
        }
    }

    async copyMusicPrompt() {
        const prompt = this.promptMusic.value;
        if (!prompt) {
            alert('No music prompt to copy. Please generate a prompt first.');
            return;
        }
        await this.copyToClipboard(prompt, 'Music prompt copied!');
    }

    async copyLyricsPrompt() {
        const prompt = this.promptLyrics.value;
        if (!prompt) {
            alert('No lyrics prompt to copy. Please generate a prompt first.');
            return;
        }
        await this.copyToClipboard(prompt, 'Lyrics prompt copied!');
    }

    async copyBothPrompts() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        if (!musicPrompt && !lyricsPrompt) {
            alert('No prompts to copy. Please generate a prompt first.');
            return;
        }

        let combined = '';
        if (musicPrompt && lyricsPrompt) {
            combined = `Styles: ${musicPrompt}\n\nLyrics: ${lyricsPrompt}`;
        } else if (musicPrompt) {
            combined = musicPrompt;
        } else {
            combined = lyricsPrompt;
        }

        await this.copyToClipboard(combined, 'Both prompts copied!');
        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = 'Copied!';
        this.copyBtn.style.background = '#34C759';
        this.copyBtn.style.color = '#FFFFFF';
        setTimeout(() => {
            this.copyBtn.textContent = originalText;
            this.copyBtn.style.background = '';
            this.copyBtn.style.color = '';
        }, 2000);
    }

    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            if (successMessage) {
                // Visual feedback could be added here if needed
            }
        } catch (error) {
            // Fallback for older browsers
            const temp = document.createElement('textarea');
            temp.value = text;
            temp.style.position = 'fixed';
            temp.style.opacity = '0';
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand('copy');
                if (successMessage) {
                    alert(successMessage);
                }
            } catch (err) {
                alert('Copy failed. Please copy manually.');
            }
            document.body.removeChild(temp);
        }
    }

    async copyPrompt() {
        // Legacy function - redirects to copyBothPrompts
        await this.copyBothPrompts();
    }

    resetForm() {
        if (confirm('Are you sure you want to reset all fields?')) {
            const selects = document.querySelectorAll('select');
            selects.forEach(select => {
                select.selectedIndex = 0;
            });
            const textFields = document.querySelectorAll('input[data-field-type="text"], textarea[data-field-type="text"]');
            textFields.forEach(field => {
                field.value = '';
            });
            this.promptMusic.value = '';
            this.promptLyrics.value = '';
            this.promptOutput.value = '';
            this.updateCharacterCounter();
            this.updateLyricDraftPreview();
        }
    }

    // Section Pin/Hide Functions
    getSectionPreferences() {
        const prefs = localStorage.getItem('sunoSectionPreferences');
        return prefs ? JSON.parse(prefs) : { pinned: [], hidden: [] };
    }

    saveSectionPreferences(prefs) {
        localStorage.setItem('sunoSectionPreferences', JSON.stringify(prefs));
    }

    togglePinSection(title) {
        const prefs = this.getSectionPreferences();
        const index = prefs.pinned.indexOf(title);
        
        if (index > -1) {
            prefs.pinned.splice(index, 1);
        } else {
            prefs.pinned.push(title);
        }
        
        this.saveSectionPreferences(prefs);
        this.reorderSections();
    }

    toggleHideSection(title) {
        const prefs = this.getSectionPreferences();
        const index = prefs.hidden.indexOf(title);
        
        if (index > -1) {
            prefs.hidden.splice(index, 1);
        } else {
            prefs.hidden.push(title);
        }
        
        this.saveSectionPreferences(prefs);
        this.applySectionVisibility();
    }

    applySectionPreferences(section, title) {
        const prefs = this.getSectionPreferences();
        const header = section.querySelector('.form-section-header');
        const pinBtn = header?.querySelector('.pin-btn');
        const hideBtn = header?.querySelector('.hide-btn');
        
        // Apply pin state
        if (prefs.pinned.includes(title)) {
            section.classList.add('pinned');
            if (pinBtn) pinBtn.style.opacity = '1';
        } else {
            section.classList.remove('pinned');
            if (pinBtn) pinBtn.style.opacity = '0.5';
        }
        
        // Apply hide state
        if (prefs.hidden.includes(title)) {
            section.style.display = 'none';
            if (hideBtn) hideBtn.innerHTML = '👁️‍🗨️';
        } else {
            section.style.display = '';
            if (hideBtn) hideBtn.innerHTML = '👁️';
        }
    }

    applySectionVisibility() {
        const prefs = this.getSectionPreferences();
        const sections = document.querySelectorAll('.form-section');
        
        sections.forEach(section => {
            const title = section.dataset.sectionTitle;
            const hideBtn = section.querySelector('.hide-btn');
            
            if (prefs.hidden.includes(title)) {
                section.style.display = 'none';
                if (hideBtn) hideBtn.innerHTML = '👁️‍🗨️';
            } else {
                section.style.display = '';
                if (hideBtn) hideBtn.innerHTML = '👁️';
            }
        });
    }

    reorderSections() {
        const prefs = this.getSectionPreferences();
        const sections = Array.from(document.querySelectorAll('.form-section'));
        const pinnedSections = [];
        const unpinnedSections = [];
        
        sections.forEach(section => {
            const title = section.dataset.sectionTitle;
            if (prefs.pinned.includes(title)) {
                section.classList.add('pinned');
                pinnedSections.push(section);
            } else {
                section.classList.remove('pinned');
                unpinnedSections.push(section);
            }
        });
        
        // Clear and re-append: pinned first, then unpinned
        this.formSections.innerHTML = '';
        pinnedSections.forEach(section => this.formSections.appendChild(section));
        unpinnedSections.forEach(section => this.formSections.appendChild(section));
        
        // Update pin button states
        sections.forEach(section => {
            const title = section.dataset.sectionTitle;
            const pinBtn = section.querySelector('.pin-btn');
            if (pinBtn) {
                pinBtn.style.opacity = prefs.pinned.includes(title) ? '1' : '0.5';
            }
        });
    }

    // History & Favorites Functions
    getHistory() {
        const history = localStorage.getItem('sunoPromptHistory');
        return history ? JSON.parse(history) : [];
    }

    saveHistory(history) {
        localStorage.setItem('sunoPromptHistory', JSON.stringify(history));
    }

    autoSaveToHistory(prompt) {
        const history = this.getHistory();
        const now = new Date();
        
        // Check if this exact prompt already exists (avoid duplicates)
        const exists = history.find(item => item.prompt === prompt);
        if (exists) {
            return; // Don't save duplicates
        }

        const newItem = {
            id: Date.now(),
            prompt: prompt,
            timestamp: now.toISOString(),
            date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            favorite: false
        };

        history.unshift(newItem);
        
        // Keep only last 50 items
        if (history.length > 50) {
            history.pop();
        }

        this.saveHistory(history);
        this.loadHistory();
    }

    savePrompt() {
        const prompt = this.promptOutput.value.trim();
        if (!prompt) {
            alert('No prompt to save. Please generate a prompt first.');
            return;
        }

        this.autoSaveToHistory(prompt);
        
        // Show feedback
        const originalText = this.saveBtn.textContent;
        this.saveBtn.textContent = 'Saved!';
        this.saveBtn.style.background = '#34C759';
        this.saveBtn.style.color = '#FFFFFF';
        
        setTimeout(() => {
            this.saveBtn.textContent = originalText;
            this.saveBtn.style.background = '';
            this.saveBtn.style.color = '';
        }, 2000);
    }

    loadHistory() {
        const history = this.getHistory();
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            this.historyEmpty.style.display = 'flex';
            return;
        }

        this.historyEmpty.style.display = 'none';

        // Sort: favorites first, then by date
        const sortedHistory = [...history].sort((a, b) => {
            if (a.favorite && !b.favorite) return -1;
            if (!a.favorite && b.favorite) return 1;
            return b.id - a.id;
        });

        sortedHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.id = item.id;

            const preview = item.prompt.length > 100 
                ? item.prompt.substring(0, 100) + '...' 
                : item.prompt;

            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-date">${item.date} ${item.time}</span>
                    <div class="history-item-actions">
                        <button class="history-item-btn favorite ${item.favorite ? 'active' : ''}" 
                                data-action="favorite" title="Toggle favorite">
                            ${item.favorite ? '★' : '☆'}
                        </button>
                        <button class="history-item-btn" data-action="use" title="Use this prompt">Use</button>
                        <button class="history-item-btn" data-action="copy" title="Copy">Copy</button>
                        <button class="history-item-btn" data-action="delete" title="Delete">×</button>
                    </div>
                </div>
                <div class="history-item-preview">${this.escapeHtml(preview)}</div>
            `;

            // Attach event listeners
            const buttons = historyItem.querySelectorAll('.history-item-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.getAttribute('data-action');
                    this.handleHistoryAction(action, item, btn);
                });
            });

            historyItem.addEventListener('click', () => {
                this.promptOutput.value = item.prompt;
                this.updateCharacterCounter();
            });

            this.historyList.appendChild(historyItem);
        });
    }

    handleHistoryAction(action, item, button) {
        const history = this.getHistory();
        const index = history.findIndex(h => h.id === item.id);

        switch (action) {
            case 'favorite':
                history[index].favorite = !history[index].favorite;
                this.saveHistory(history);
                this.loadHistory();
                break;

            case 'use':
                this.promptOutput.value = item.prompt;
                this.updateCharacterCounter();
                // Switch to output panel focus
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;

            case 'copy':
                navigator.clipboard.writeText(item.prompt).then(() => {
                    const originalText = button.textContent;
                    button.textContent = '✓';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 1000);
                });
                break;

            case 'delete':
                if (confirm('Delete this prompt from history?')) {
                    history.splice(index, 1);
                    this.saveHistory(history);
                    this.loadHistory();
                }
                break;
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            localStorage.removeItem('sunoPromptHistory');
            this.loadHistory();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Presets Functions
    getPresets() {
        const presets = localStorage.getItem('sunoPresets');
        return presets ? JSON.parse(presets) : [];
    }

    savePresets(presets) {
        localStorage.setItem('sunoPresets', JSON.stringify(presets));
    }

    savePreset() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        const formValues = this.getFormValues();
        
        if (!musicPrompt && !lyricsPrompt && Object.keys(formValues).length === 0) {
            alert('No settings to save. Please configure some options first.');
            return;
        }

        const name = prompt('Enter a name for this preset:');
        if (!name || !name.trim()) {
            return;
        }

        const category = prompt('Enter a category (optional, e.g., "Electronic", "Turkish", "Experimental"):') || 'General';

        const presets = this.getPresets();
        const newPreset = {
            id: Date.now(),
            name: name.trim(),
            category: category.trim() || 'General',
            musicPrompt: musicPrompt,
            lyricsPrompt: lyricsPrompt,
            formValues: formValues,
            timestamp: new Date().toISOString()
        };

        presets.push(newPreset);
        this.savePresets(presets);
        this.loadPresets();
        
        alert(`Preset "${name}" saved successfully!`);
    }

    loadPresets() {
        const presets = this.getPresets();
        
        if (!this.presetsList || !this.presetsEmpty) return;

        this.presetsList.innerHTML = '';
        
        if (presets.length === 0) {
            this.presetsEmpty.style.display = 'block';
            return;
        }

        this.presetsEmpty.style.display = 'none';

        // Group by category
        const grouped = {};
        presets.forEach(preset => {
            const cat = preset.category || 'General';
            if (!grouped[cat]) {
                grouped[cat] = [];
            }
            grouped[cat].push(preset);
        });

        // Render by category
        Object.keys(grouped).sort().forEach(category => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'preset-category-header';
            categoryHeader.textContent = category;
            this.presetsList.appendChild(categoryHeader);

            grouped[category].forEach(preset => {
                const presetItem = document.createElement('div');
                presetItem.className = 'preset-item';
                presetItem.dataset.presetId = preset.id;

                const presetInfo = document.createElement('div');
                presetInfo.className = 'preset-info';
                
                const presetName = document.createElement('div');
                presetName.className = 'preset-name';
                presetName.textContent = preset.name;
                
                const presetMeta = document.createElement('div');
                presetMeta.className = 'preset-meta';
                const date = new Date(preset.timestamp);
                presetMeta.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                
                presetInfo.appendChild(presetName);
                presetInfo.appendChild(presetMeta);

                const presetActions = document.createElement('div');
                presetActions.className = 'preset-actions';
                
                const loadBtn = document.createElement('button');
                loadBtn.className = 'preset-action-btn load-btn';
                loadBtn.title = 'Load preset';
                loadBtn.textContent = 'Load';
                loadBtn.addEventListener('click', () => this.loadPreset(preset.id));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'preset-action-btn delete-btn';
                deleteBtn.title = 'Delete preset';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => this.deletePreset(preset.id));
                
                presetActions.appendChild(loadBtn);
                presetActions.appendChild(deleteBtn);

                presetItem.appendChild(presetInfo);
                presetItem.appendChild(presetActions);
                this.presetsList.appendChild(presetItem);
            });
        });
    }

    loadPreset(presetId) {
        const presets = this.getPresets();
        const preset = presets.find(p => p.id === presetId);
        
        if (!preset) {
            alert('Preset not found.');
            return;
        }

        // Load form values
        if (preset.formValues) {
            Object.keys(preset.formValues).forEach(key => {
                const select = document.getElementById(key);
                if (select) {
                    const optionIndex = Array.from(select.options).findIndex(
                        opt => opt.value === preset.formValues[key]
                    );
                    if (optionIndex > 0) {
                        select.selectedIndex = optionIndex;
                        if (key.startsWith('world_')) {
                            select.dispatchEvent(new Event('change'));
                        }
                    }
                } else {
                    const input = document.getElementById(key);
                    if (input) {
                        input.value = preset.formValues[key] || '';
                    }
                }
            });
            
            // Handle BPM slider
            if (preset.formValues.bpm) {
                const bpmSlider = document.getElementById('bpm-slider');
                if (bpmSlider) {
                    bpmSlider.value = preset.formValues.bpm;
                    const bpmValue = document.getElementById('bpm-value');
                    if (bpmValue) {
                        bpmValue.textContent = `${preset.formValues.bpm} BPM`;
                    }
                }
            }
        }

        // Wait for world music to populate, then set prompts
        setTimeout(() => {
            if (preset.musicPrompt !== undefined) {
                this.promptMusic.value = preset.musicPrompt;
            }
            if (preset.lyricsPrompt !== undefined) {
                this.promptLyrics.value = preset.lyricsPrompt;
            }
            
            // If prompts not saved, generate from form values
            if (!preset.musicPrompt && !preset.lyricsPrompt && preset.formValues) {
                this.generatePrompt();
            }
            
            this.updateCharacterCounter();
            this.updateLyricDraftPreview();
        }, 300);
    }

    deletePreset(presetId) {
        if (!confirm('Are you sure you want to delete this preset?')) {
            return;
        }

        const presets = this.getPresets();
        const filtered = presets.filter(p => p.id !== presetId);
        this.savePresets(filtered);
        this.loadPresets();
    }

    // Templates Functions
    getTemplates() {
        return [
            {
                id: 'electronic',
                title: 'Electronic Dance',
                category: 'Electronic',
                description: 'High-energy electronic track with modern production',
                preview: 'Electronic, Synthwave, Upbeat (120-140 BPM), Energetic mood...',
                values: {
                    genre: 'Electronic',
                    subgenre: 'Synthwave',
                    tempo: 'Upbeat (120-140 BPM)',
                    mood: 'Energetic',
                    lead: 'Synthesizer',
                    percussion: 'Electronic Drums',
                    bass: 'Deep Sub Bass',
                    mixing_style: 'Modern Digital',
                    production_style: 'Professional Mix'
                }
            },
            {
                id: 'jazz',
                title: 'Smooth Jazz',
                category: 'Jazz',
                description: 'Relaxing jazz with warm instruments',
                preview: 'Jazz, Smooth Jazz, Moderate (80-100 BPM), Calm mood...',
                values: {
                    genre: 'Jazz',
                    subgenre: 'Smooth Jazz',
                    tempo: 'Moderate (80-100 BPM)',
                    mood: 'Calm',
                    harmony: 'Jazz Harmony',
                    lead: 'Saxophone',
                    accompaniment: 'Strings',
                    bass: 'Warm Analog Bass',
                    mixing_style: 'Warm and Saturated',
                    production_style: 'Studio Recorded'
                }
            },
            {
                id: 'turkish_makam',
                title: 'Turkish Makam',
                category: 'World',
                description: 'Traditional Turkish makam music',
                preview: 'Turkish Hicaz makam style, Slow (60-80 BPM)...',
                values: {
                    makam: 'Hicaz',
                    tempo: 'Slow (60-80 BPM)',
                    mood: 'Melancholic',
                    lead: 'Oud',
                    accompaniment: 'Strings',
                    percussion: 'Hand Percussion',
                    mixing_style: 'Warm and Saturated',
                    production_style: 'Traditional'
                }
            },
            {
                id: 'world_middle_east',
                title: 'Middle Eastern',
                category: 'World',
                description: 'Authentic Middle Eastern music with traditional instruments',
                preview: 'Middle East, Arabic Classical, with Oud...',
                values: {
                    world_region: 'Middle East',
                    world_tradition: 'Arabic Classical',
                    world_instruments: 'Oud',
                    tempo: 'Moderate (80-100 BPM)',
                    mood: 'Mysterious',
                    rhythm: '4/4 Steady',
                    percussion: 'Hand Percussion',
                    mixing_style: 'Warm and Saturated',
                    production_style: 'Traditional'
                }
            },
            {
                id: 'lo_fi',
                title: 'Lo-fi Hip Hop',
                category: 'Electronic',
                description: 'Chill lo-fi beats for studying and relaxing',
                preview: 'Lo-fi, Jazz Lo-fi, Slow (60-80 BPM), Calm mood...',
                values: {
                    genre: 'Lo-fi',
                    subgenre: 'Jazz Lo-fi',
                    tempo: 'Slow (60-80 BPM)',
                    mood: 'Calm',
                    harmony: 'Jazz Harmony',
                    lead: 'Piano',
                    percussion: 'Minimal Percussion',
                    bass: 'Warm Analog Bass',
                    mixing_style: 'Lo-fi Aesthetic',
                    production_style: 'Bedroom Production'
                }
            },
            {
                id: 'afrobeats',
                title: 'Afrobeats',
                category: 'World',
                description: 'Vibrant Afrobeats with African rhythms',
                preview: 'Afrobeats, Upbeat (120-140 BPM), Joyful mood...',
                values: {
                    genre: 'Afrobeats',
                    tempo: 'Upbeat (120-140 BPM)',
                    mood: 'Joyful',
                    rhythm: 'Syncopated',
                    percussion: 'Hand Percussion',
                    bass: '808 Style',
                    lead: 'Synthesizer',
                    mixing_style: 'Bright and Crisp',
                    production_style: 'Modern Digital'
                }
            },
            {
                id: 'cinematic',
                title: 'Cinematic',
                category: 'Cinematic',
                description: 'Epic cinematic score with orchestral elements',
                preview: 'Cinematic, Very Slow (40-60 BPM), Dramatic mood...',
                values: {
                    genre: 'Cinematic',
                    tempo: 'Very Slow (40-60 BPM)',
                    mood: 'Dramatic',
                    harmony: 'Minor',
                    lead: 'Violin',
                    accompaniment: 'Strings',
                    bass: 'Deep Sub Bass',
                    mixing_style: 'Wide Stereo',
                    production_style: 'Cinematic'
                }
            },
            {
                id: 'rock',
                title: 'Rock',
                category: 'Rock',
                description: 'Classic rock with electric guitars',
                preview: 'Rock, Progressive Rock, Medium (100-120 BPM)...',
                values: {
                    genre: 'Rock',
                    subgenre: 'Progressive Rock',
                    tempo: 'Medium (100-120 BPM)',
                    mood: 'Energetic',
                    lead: 'Electric Guitar',
                    accompaniment: 'Rhythm Guitar',
                    bass: 'Punchy Electric Bass',
                    percussion: 'Acoustic Drums',
                    mixing_style: 'Raw and Organic',
                    production_style: 'Live Performance'
                }
            },
            {
                id: 'ambient',
                title: 'Ambient',
                category: 'Electronic',
                description: 'Atmospheric ambient soundscape',
                preview: 'Ambient, Very Slow (40-60 BPM), Peaceful mood...',
                values: {
                    genre: 'Ambient',
                    tempo: 'Very Slow (40-60 BPM)',
                    mood: 'Peaceful',
                    harmony: 'Modal',
                    lead: 'Synthesizer',
                    accompaniment: 'Atmospheric Textures',
                    percussion: 'No Percussion',
                    bass: 'Minimal Bass',
                    mixing_style: 'Wide Stereo',
                    production_style: 'Studio Recorded'
                }
            },
            {
                id: 'indie',
                title: 'Indie Pop',
                category: 'Pop',
                description: 'Indie pop with organic instruments',
                preview: 'Indie, Indie Pop, Medium (100-120 BPM)...',
                values: {
                    genre: 'Indie',
                    subgenre: 'Indie Pop',
                    tempo: 'Medium (100-120 BPM)',
                    mood: 'Uplifting',
                    lead: 'Guitar',
                    accompaniment: 'Strings',
                    bass: 'Acoustic Bass',
                    percussion: 'Acoustic Drums',
                    vocal_type: 'Female Lead',
                    vocal_style: 'Smooth',
                    mixing_style: 'Clean and Polished',
                    production_style: 'Studio Recorded'
                }
            }
        ];
    }

    loadTemplates() {
        const templates = this.getTemplates();
        this.templatesList.innerHTML = '';

        templates.forEach(template => {
            const templateItem = document.createElement('div');
            templateItem.className = 'template-item';
            templateItem.dataset.id = template.id;

            templateItem.innerHTML = `
                <div class="template-item-header">
                    <span class="template-item-title">${template.title}</span>
                    <span class="template-item-category">${template.category}</span>
                </div>
                <div class="template-item-description">${template.description}</div>
                <div class="template-item-preview">${template.preview}</div>
            `;

            templateItem.addEventListener('click', () => {
                this.loadTemplate(template);
            });

            this.templatesList.appendChild(templateItem);
        });
    }

    loadTemplate(template) {
        // Reset form first
        const selects = document.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });

        // Load template values
        const values = template.values;
        
        // Set regular selects
        Object.keys(values).forEach(key => {
            if (key.startsWith('world_')) return; // Handle world music separately
            
            const select = document.getElementById(key);
            if (select) {
                const optionIndex = Array.from(select.options).findIndex(opt => opt.value === values[key]);
                if (optionIndex > 0) {
                    select.selectedIndex = optionIndex;
                }
            }
        });

        // Handle world music separately
        if (values.world_region) {
            const regionSelect = document.getElementById('world_region');
            if (regionSelect) {
                const regionIndex = Array.from(regionSelect.options).findIndex(opt => opt.value === values.world_region);
                if (regionIndex > 0) {
                    regionSelect.selectedIndex = regionIndex;
                    regionSelect.dispatchEvent(new Event('change'));
                    
                    setTimeout(() => {
                        if (values.world_tradition) {
                            const traditionSelect = document.getElementById('world_tradition');
                            if (traditionSelect) {
                                const tradIndex = Array.from(traditionSelect.options).findIndex(opt => opt.value === values.world_tradition);
                                if (tradIndex > 0) {
                                    traditionSelect.selectedIndex = tradIndex;
                                    traditionSelect.dispatchEvent(new Event('change'));
                                    
                                    setTimeout(() => {
                                        if (values.world_instruments) {
                                            const instSelect = document.getElementById('world_instruments');
                                            if (instSelect) {
                                                const instIndex = Array.from(instSelect.options).findIndex(opt => opt.value === values.world_instruments);
                                                if (instIndex > 0) {
                                                    instSelect.selectedIndex = instIndex;
                                                }
                                            }
                                        }
                                    }, 100);
                                }
                            }
                        }
                    }, 100);
                }
            }
        }

        // Generate prompt after a short delay
        setTimeout(() => {
            this.generatePrompt();
            
            // Visual feedback
            const templateItem = document.querySelector(`[data-id="${template.id}"]`);
            if (templateItem) {
                templateItem.style.background = '#34C759';
                templateItem.style.color = '#FFFFFF';
                setTimeout(() => {
                    templateItem.style.background = '';
                    templateItem.style.color = '';
                }, 1000);
            }
        }, 300);
    }

    // Theme Functions
    initTheme() {
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add toggle listener
        this.themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                return;
            }

            // Ctrl/Cmd combinations
            if (e.ctrlKey || e.metaKey) {
                switch (e.key.toLowerCase()) {
                    case 'g':
                        e.preventDefault();
                        this.generatePrompt();
                        break;
                    case 'c':
                        e.preventDefault();
                        this.copyPrompt();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.generateRandomPrompt();
                        break;
                    case 'o':
                        e.preventDefault();
                        this.optimizePrompt();
                        break;
                    case 'e':
                        e.preventDefault();
                        this.toggleExportDropdown();
                        break;
                    case 'i':
                        e.preventDefault();
                        this.importFile();
                        break;
                    case 'd':
                        e.preventDefault();
                        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                        this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
                        break;
                }
            }

            // Escape key
            if (e.key === 'Escape') {
                if (this.analysisModal.classList.contains('active')) {
                    this.closeModal();
                }
                if (this.exportDropdown.classList.contains('active')) {
                    this.exportDropdown.classList.remove('active');
                }
            }
        });
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SunoPromptBuilder();
});

