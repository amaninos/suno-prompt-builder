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
        this.aiAssistBtn = document.getElementById('ai-assist-btn');
        this.historyList = document.getElementById('history-list');
        this.historyEmpty = document.getElementById('history-empty');
        this.clearHistoryBtn = document.getElementById('clear-history-btn');
        this.templatesList = document.getElementById('templates-list');
        this.presetsList = document.getElementById('presets-list');
        this.presetsEmpty = document.getElementById('presets-empty');
        this.savePresetBtn = document.getElementById('save-preset-btn');
        this.livePreviewToggle = document.getElementById('live-preview-toggle');
        this.livePreviewTimeout = null;
        this.settingsSearch = document.getElementById('settings-search');
        this.clearSearchBtn = document.getElementById('clear-search-btn');
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
        this.shareBtn = document.getElementById('share-btn');
        // Share dropdown is inside button-dropdown, need to find it after DOM loads
        this.shareDropdown = null;
        this.shareModal = document.getElementById('share-modal');
        this.shareUrlInput = document.getElementById('share-url-input');
        this.copyShareUrlBtn = document.getElementById('copy-share-url-btn');
        this.closeShareModal = document.getElementById('close-share-modal');
        this.themeToggle = document.getElementById('theme-toggle');
        this.visualEditorToggle = document.getElementById('visual-editor-toggle');
        this.visualEditorModal = document.getElementById('visual-editor-modal');
        this.closeVisualEditor = document.getElementById('close-visual-editor');
        this.saveVisualSettings = document.getElementById('save-visual-settings');
        this.resetVisualSettings = document.getElementById('reset-visual-settings');
        this.lyricSummaryBtn = null;
        this.lyricDraftOutput = null;
        this.lyricDraftCopyBtn = null;
        this.lyricDraftRegenBtn = null;
        this.currentLyricDraft = '';
        this.lyricPreviewTimeout = null;
        this.draggedSection = null;
        this.handleSectionDragStart = this.handleSectionDragStart.bind(this);
        this.handleSectionDragOver = this.handleSectionDragOver.bind(this);
        this.handleSectionDragEnd = this.handleSectionDragEnd.bind(this);
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercentageEl = document.getElementById('progress-percentage');
        this.progressMessageEl = document.getElementById('progress-message');
        this.previewCombined = document.getElementById('preview-combined');
        this.previewStats = document.getElementById('preview-stats');
        this.presetFilterContainer = document.getElementById('preset-filter-buttons');
        this.presetSearchInput = document.getElementById('preset-search-input');
        this.presetGalleryGrid = document.getElementById('preset-gallery-grid');
        this.presetGalleryEmpty = document.getElementById('preset-gallery-empty');
        this.quickPresets = [];
        this.quickPresetFilter = 'All';
        this.quickPresetSearch = '';
        this.quickPresetSearchTimeout = null;
        this.progressConfig = [
            { id: 'genre', label: 'Genre' },
            { id: 'subgenre', label: 'Sub-Genre' },
            { id: 'tempo', label: 'Tempo' },
            { id: 'mood', label: 'Mood' },
            { id: 'lead', label: 'Lead Instrument' },
            { id: 'structure_flow', label: 'Structure & Flow' },
            { id: 'mixing_style', label: 'Mixing Style' },
            { id: 'production_style', label: 'Production Style' },
            { id: 'lyric_theme', label: 'Lyric Theme' },
            { id: 'lyric_emotion', label: 'Lyric Emotion' },
            { id: 'lyric_structure', label: 'Lyric Structure' }
        ];
        this.progressListenersAttached = false;
        
        // Feedback system
        this.feedbackModal = document.getElementById('feedback-modal');
        this.closeFeedbackModal = document.getElementById('close-feedback-modal');
        this.feedbackOptions = this.feedbackModal ? this.feedbackModal.querySelectorAll('.feedback-option') : [];
        this.submitFeedbackBtn = document.getElementById('submit-feedback');
        this.feedbackComment = document.getElementById('feedback-comment');
        this.subtleFeedbackBtn = document.getElementById('quick-feedback-btn');
        this.subtleFeedback = document.getElementById('subtle-feedback');
        this.feedbackInlineCard = document.getElementById('feedback-inline-card');
        this.feedbackInlineOptions = this.feedbackInlineCard ? this.feedbackInlineCard.querySelectorAll('.feedback-option') : null;
        this.feedbackInlineComment = document.getElementById('feedback-inline-comment');
        this.feedbackInlineInput = document.getElementById('feedback-inline-input');
        this.feedbackInlineSubmit = document.getElementById('feedback-inline-submit');
        this.dismissFeedbackInline = document.getElementById('dismiss-feedback-inline');
        this.inlineFeedbackRating = null;
        this.whatsNewToggle = document.getElementById('whats-new-toggle');
        this.whatsNewModal = document.getElementById('whats-new-modal');
        this.closeWhatsNewModalBtn = document.getElementById('close-whats-new-modal');
        this.feedbackGiven = false;
        this.usageCount = 0;
        this.sessionStartTime = Date.now();
        this.promptCopiedCount = 0;
        this.promptSavedCount = 0;
        
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
        this.initPresetGallery();
        this.initTheme();
        this.setupKeyboardShortcuts();
        this.initFeedbackSystem();
        this.initInlineFeedbackCard();
        this.initWhatsNewModal();
        this.initSocialShareButtons();
        this.initVisualEditor();
        this.initSearch();
        this.initFavorites();
        this.initHistorySearch();
        this.initCommunityFeatures();
        this.initAnalytics();
        this.initBatchGenerate();
        this.initPromptVersioning();
        this.trackUsage();
        this.loadSharedPrompt();
        
        // Update analytics on tab switch
        const analyticsTab = document.querySelector('[data-tab="analytics"]');
        if (analyticsTab) {
            analyticsTab.addEventListener('click', () => {
                setTimeout(() => this.updateAnalytics(), 100);
            });
        }
        
        // Initialize share dropdown after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.shareDropdown = document.querySelector('.share-dropdown');
            this.initShareSystem();
        }, 100);
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
        this.reorderSections();
        this.initSectionDragAndDrop();
        this.attachProgressListeners();
        this.updateProgressIndicator();
        this.updateAdvancedPreview();
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

        const dragHandle = document.createElement('span');
        dragHandle.className = 'section-drag-handle';
        dragHandle.title = 'Drag to reorder';
        dragHandle.innerHTML = '↕';
        dragHandle.addEventListener('mousedown', (e) => e.stopPropagation());

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;

        headerLeft.appendChild(dragHandle);
        headerLeft.appendChild(titleEl);
        
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
        this.saveBtn.addEventListener('click', () => this.savePromptWithVersion());
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
        const exportCsvBtn = document.getElementById('export-csv-btn');
        const exportSunoBtn = document.getElementById('export-suno-btn');
        if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => this.exportAsCSV());
        if (exportSunoBtn) exportSunoBtn.addEventListener('click', () => this.exportForSuno());
        this.importBtn.addEventListener('click', () => this.importFile());
        this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
        
        // Batch generate
        const batchGenerateBtn = document.getElementById('batch-generate-btn');
        const closeBatchModal = document.getElementById('close-batch-modal');
        const startBatchGenerateBtn = document.getElementById('start-batch-generate-btn');
        const cancelBatchBtn = document.getElementById('cancel-batch-btn');
        const batchExportAllBtn = document.getElementById('batch-export-all-btn');
        if (batchGenerateBtn) batchGenerateBtn.addEventListener('click', () => this.showBatchModal());
        if (closeBatchModal) closeBatchModal.addEventListener('click', () => this.closeBatchModal());
        if (startBatchGenerateBtn) startBatchGenerateBtn.addEventListener('click', () => this.startBatchGenerate());
        if (cancelBatchBtn) cancelBatchBtn.addEventListener('click', () => this.closeBatchModal());
        if (batchExportAllBtn) batchExportAllBtn.addEventListener('click', () => this.exportBatchResults());
        
        // Share system
        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleShareDropdown(e);
            });
        } else {
            console.error('Share button not found');
        }
        const shareUrlBtn = document.getElementById('share-url-btn');
        const shareTwitterBtn = document.getElementById('share-twitter-btn');
        const shareFacebookBtn = document.getElementById('share-facebook-btn');
        const shareRedditBtn = document.getElementById('share-reddit-btn');
        const shareLinkedinBtn = document.getElementById('share-linkedin-btn');
        
        if (shareUrlBtn) shareUrlBtn.addEventListener('click', () => this.showShareModal());
        if (shareTwitterBtn) shareTwitterBtn.addEventListener('click', () => this.shareOnTwitter());
        if (shareFacebookBtn) shareFacebookBtn.addEventListener('click', () => this.shareOnFacebook());
        if (shareRedditBtn) shareRedditBtn.addEventListener('click', () => this.shareOnReddit());
        if (shareLinkedinBtn) shareLinkedinBtn.addEventListener('click', () => this.shareOnLinkedIn());
        
        if (this.closeShareModal) {
            this.closeShareModal.addEventListener('click', () => this.closeShareModalFunc());
        }
        if (this.copyShareUrlBtn) {
            this.copyShareUrlBtn.addEventListener('click', () => this.copyShareUrl());
        }
        
        // Modal share buttons
        const shareTwitterModalBtn = document.getElementById('share-twitter-modal-btn');
        const shareFacebookModalBtn = document.getElementById('share-facebook-modal-btn');
        const shareRedditModalBtn = document.getElementById('share-reddit-modal-btn');
        const shareLinkedinModalBtn = document.getElementById('share-linkedin-modal-btn');
        
        if (shareTwitterModalBtn) shareTwitterModalBtn.addEventListener('click', () => this.shareOnTwitter());
        if (shareFacebookModalBtn) shareFacebookModalBtn.addEventListener('click', () => this.shareOnFacebook());
        if (shareRedditModalBtn) shareRedditModalBtn.addEventListener('click', () => this.shareOnReddit());
        if (shareLinkedinModalBtn) shareLinkedinModalBtn.addEventListener('click', () => this.shareOnLinkedIn());
        
        if (this.savePresetBtn) {
            this.savePresetBtn.addEventListener('click', () => this.savePreset());
        }

        if (this.aiAssistBtn) {
            this.aiAssistBtn.addEventListener('click', () => this.suggestWithAI());
        }
        
        // Reset sections button
        const resetSectionsBtn = document.getElementById('reset-sections-btn');
        if (resetSectionsBtn) {
            resetSectionsBtn.addEventListener('click', () => this.resetSections());
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.exportBtn.contains(e.target) && !this.exportDropdown.contains(e.target)) {
                this.exportDropdown.classList.remove('active');
            }
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
        this.updateAdvancedPreview();
        this.updateProgressIndicator();
        
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
            this.updateProgressIndicator();
            
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
        this.trackCopyAction();
    }

    async copyLyricsPrompt() {
        const prompt = this.promptLyrics.value;
        if (!prompt) {
            alert('No lyrics prompt to copy. Please generate a prompt first.');
            return;
        }
        await this.copyToClipboard(prompt, 'Lyrics prompt copied!');
        this.trackCopyAction();
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
        
        // Track usage silently
        this.trackCopyAction();
    }

    async copyToClipboard(text, successMessage) {
        try {
            await navigator.clipboard.writeText(text);
            if (successMessage) {
                this.showToast(successMessage, 'success');
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
                    this.showToast(successMessage, 'success');
                }
            } catch (err) {
                this.showToast('Copy failed. Please copy manually.', 'error');
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
            this.updateProgressIndicator();
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

    getSectionOrder() {
        const order = localStorage.getItem('sunoSectionOrder');
        return order ? JSON.parse(order) : [];
    }

    saveSectionOrder(order) {
        localStorage.setItem('sunoSectionOrder', JSON.stringify(order));
    }

    saveCurrentSectionOrder() {
        if (!this.formSections) return;
        const sections = Array.from(this.formSections.querySelectorAll('.form-section'));
        const order = sections.map(section => section.dataset.sectionTitle);
        this.saveSectionOrder(order);
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

    resetSections() {
        if (confirm('Reset all section preferences? This will show all hidden sections and unpin all pinned sections.')) {
            localStorage.removeItem('sunoSectionPreferences');
            location.reload();
        }
    }

    reorderSections() {
        const prefs = this.getSectionPreferences();
        const sections = Array.from(document.querySelectorAll('.form-section'));
        const savedOrder = this.getSectionOrder();
        const orderIndex = (title) => {
            const idx = savedOrder.indexOf(title);
            return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        };
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

        pinnedSections.sort((a, b) => orderIndex(a.dataset.sectionTitle) - orderIndex(b.dataset.sectionTitle));
        unpinnedSections.sort((a, b) => orderIndex(a.dataset.sectionTitle) - orderIndex(b.dataset.sectionTitle));
        
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

    attachProgressListeners() {
        if (!this.formSections || this.progressListenersAttached) return;
        const inputs = this.formSections.querySelectorAll('select, input[type="text"], textarea');
        inputs.forEach(input => {
            const eventName = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventName, () => {
                this.updateProgressIndicator();
                this.updateAdvancedPreview();
            });
        });
        this.progressListenersAttached = true;
    }

    updateProgressIndicator() {
        if (!this.progressFill || !this.progressPercentageEl || !this.progressMessageEl) return;
        const total = this.progressConfig.length;
        if (total === 0) return;

        let completed = 0;
        const missing = [];

        this.progressConfig.forEach(field => {
            const el = document.getElementById(field.id);
            if (!el) {
                missing.push(field.label);
                return;
            }
            const value = (el.value || '').trim();
            if (value) {
                completed++;
            } else {
                missing.push(field.label);
            }
        });

        const percentage = Math.round((completed / total) * 100);
        this.progressFill.style.width = `${percentage}%`;
        this.progressPercentageEl.textContent = `${percentage}%`;

        let message = '';
        if (percentage >= 80 && missing.length === 0) {
            message = 'Great! Your prompt is ready to go.';
        } else if (missing.length === total) {
            message = 'Select a genre to get started.';
        } else {
            const nextSteps = missing.slice(0, 3).join(', ');
            message = `Next focus: ${nextSteps}`;
        }

        this.progressMessageEl.textContent = message;

        this.progressFill.classList.remove('progress-low', 'progress-medium', 'progress-good');
        if (percentage < 40) {
            this.progressFill.classList.add('progress-low');
        } else if (percentage < 80) {
            this.progressFill.classList.add('progress-medium');
        } else {
            this.progressFill.classList.add('progress-good');
        }

        // Update quality score
        this.updateQualityScore();
    }

    updateQualityScore() {
        const qualityScoreEl = document.getElementById('quality-score');
        const qualitySuggestionsEl = document.getElementById('quality-suggestions');
        const qualitySuggestionsListEl = document.getElementById('quality-suggestions-list');
        
        if (!qualityScoreEl) return;

        const musicPrompt = (this.promptMusic.value || '').trim();
        const lyricsPrompt = (this.promptLyrics.value || '').trim();
        
        let score = 0;
        const suggestions = [];

        // Check completion (0-4 points)
        const total = this.progressConfig.length;
        let completed = 0;
        this.progressConfig.forEach(field => {
            const el = document.getElementById(field.id);
            if (el && (el.value || '').trim()) completed++;
        });
        const completionRatio = completed / total;
        score += Math.round(completionRatio * 4);

        // Check character limits (0-2 points)
        if (musicPrompt.length > 0 && musicPrompt.length <= 1000) {
            score += 1;
            if (musicPrompt.length >= 200 && musicPrompt.length <= 800) {
                score += 1; // Optimal length
            } else if (musicPrompt.length > 800) {
                suggestions.push('Music prompt is getting long. Consider optimizing.');
            }
        } else if (musicPrompt.length > 1000) {
            suggestions.push('Music prompt exceeds 1000 characters. Use Optimize button.');
        }

        if (lyricsPrompt.length > 0 && lyricsPrompt.length <= 200) {
            score += 1;
            if (lyricsPrompt.length >= 50 && lyricsPrompt.length <= 180) {
                score += 1; // Optimal length
            } else if (lyricsPrompt.length > 180) {
                suggestions.push('Lyrics prompt is close to the 200 character limit.');
            }
        } else if (lyricsPrompt.length > 200) {
            suggestions.push('Lyrics prompt exceeds 200 characters.');
        }

        // Check for essential fields (0-2 points)
        const essentialFields = ['genre', 'tempo', 'mood'];
        let essentialCount = 0;
        essentialFields.forEach(fieldId => {
            const el = document.getElementById(fieldId);
            if (el && (el.value || '').trim()) essentialCount++;
        });
        if (essentialCount === essentialFields.length) {
            score += 2;
        } else if (essentialCount > 0) {
            score += 1;
            const missingEssential = essentialFields.filter(fieldId => {
                const el = document.getElementById(fieldId);
                return !el || !(el.value || '').trim();
            });
            if (missingEssential.length > 0) {
                suggestions.push(`Add ${missingEssential.map(id => this.progressConfig.find(f => f.id === id)?.label || id).join(', ')} for better results.`);
            }
        }

        // Ensure score is between 0-10
        score = Math.min(10, Math.max(0, score));

        qualityScoreEl.textContent = `⭐ ${score}/10`;
        qualityScoreEl.className = 'quality-score';
        if (score >= 8) {
            qualityScoreEl.classList.add('quality-excellent');
        } else if (score >= 6) {
            qualityScoreEl.classList.add('quality-good');
        } else if (score >= 4) {
            qualityScoreEl.classList.add('quality-medium');
        } else {
            qualityScoreEl.classList.add('quality-low');
        }

        // Show suggestions if any
        if (suggestions.length > 0 && qualitySuggestionsEl && qualitySuggestionsListEl) {
            qualitySuggestionsListEl.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');
            qualitySuggestionsEl.style.display = 'block';
        } else if (qualitySuggestionsEl) {
            qualitySuggestionsEl.style.display = 'none';
        }
    }

    updateAdvancedPreview() {
        if (!this.previewCombined) return;
        const musicPrompt = (this.promptMusic.value || '').trim();
        const lyricsPrompt = (this.promptLyrics.value || '').trim();

        if (!musicPrompt && !lyricsPrompt) {
            this.previewCombined.innerHTML = '<p class="preview-placeholder">Generate or type to see a highlighted preview of your prompt.</p>';
            if (this.previewStats) this.previewStats.textContent = '0 characters';
            return;
        }

        const sections = [];
        if (musicPrompt) {
            sections.push(`
                <div class="preview-section">
                    <span class="preview-label">Styles</span>
                    <div class="preview-text">${this.escapeHtml(musicPrompt)}</div>
                </div>
            `);
        }

        if (lyricsPrompt) {
            sections.push(`
                <div class="preview-section">
                    <span class="preview-label">Lyrics</span>
                    <div class="preview-text">${this.escapeHtml(lyricsPrompt)}</div>
                </div>
            `);
        }

        this.previewCombined.innerHTML = sections.join('');
        const totalChars = musicPrompt.length + lyricsPrompt.length;
        if (this.previewStats) {
            this.previewStats.textContent = `${totalChars} characters`;
        }
    }

    initSectionDragAndDrop() {
        if (!this.formSections) return;
        const sections = this.formSections.querySelectorAll('.form-section');

        if (!this.getSectionOrder().length) {
            this.saveCurrentSectionOrder();
        }

        sections.forEach(section => {
            if (section.dataset.dragInitialized === 'true') return;
            section.dataset.dragInitialized = 'true';
            section.setAttribute('draggable', 'true');
            section.addEventListener('dragstart', this.handleSectionDragStart);
            section.addEventListener('dragover', this.handleSectionDragOver);
            section.addEventListener('dragend', this.handleSectionDragEnd);
        });
    }

    handleSectionDragStart(e) {
        const section = e.currentTarget;
        const isDragHandle = e.target.classList.contains('section-drag-handle') || !!e.target.closest('.section-drag-handle');

        if (!isDragHandle) {
            e.preventDefault();
            return;
        }

        if (section.classList.contains('pinned')) {
            e.preventDefault();
            this.showToast('Unpin this section to reorder it.', 'info');
            return;
        }

        this.draggedSection = section;
        section.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', section.dataset.sectionTitle || '');
    }

    handleSectionDragOver(e) {
        if (!this.draggedSection) return;
        const target = e.currentTarget;
        if (target === this.draggedSection || target.classList.contains('pinned')) {
            return;
        }

        e.preventDefault();
        const bounding = target.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        const shouldInsertBefore = offset < bounding.height / 2;

        if (shouldInsertBefore) {
            this.formSections.insertBefore(this.draggedSection, target);
        } else {
            this.formSections.insertBefore(this.draggedSection, target.nextElementSibling);
        }
    }

    handleSectionDragEnd() {
        if (this.draggedSection) {
            this.draggedSection.classList.remove('dragging');
        }
        this.draggedSection = null;
        this.saveCurrentSectionOrder();
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
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        if (!musicPrompt && !lyricsPrompt) {
            this.showToast('No prompt to save. Please generate a prompt first.', 'error');
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

        this.autoSaveToHistory(combined);
        this.showToast('Prompt saved to history!', 'success');
        
        // Track usage silently
        this.trackSaveAction();
    }


    handleHistoryAction(action, item, button) {
        const history = this.getHistory();
        const index = history.findIndex(h => h.id === item.id);

        switch (action) {
            case 'favorite':
                history[index].favorite = !history[index].favorite;
                this.saveHistory(history);
                const filterBtn = document.getElementById('filter-favorites-btn');
                const isFiltered = filterBtn?.classList.contains('active');
                this.loadHistory(isFiltered);
                this.showToast(history[index].favorite ? 'Added to favorites!' : 'Removed from favorites!', 'success');
                break;

            case 'use':
                this.promptOutput.value = item.prompt;
                this.updateCharacterCounter();
                this.updateAdvancedPreview();
                this.updateProgressIndicator();
                // Switch to output panel focus
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;

            case 'copy':
                navigator.clipboard.writeText(item.prompt).then(() => {
                    this.showToast('Prompt copied to clipboard!', 'success');
                });
                break;

            case 'delete':
                if (confirm('Delete this prompt from history?')) {
                    history.splice(index, 1);
                    this.saveHistory(history);
                    const filterBtn = document.getElementById('filter-favorites-btn');
                    const isFiltered = filterBtn?.classList.contains('active');
                    this.loadHistory(isFiltered);
                    this.showToast('Prompt deleted!', 'success');
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

    suggestWithAI() {
        if (!this.quickPresets || !this.quickPresets.length) {
            this.quickPresets = this.getQuickPresets();
        }

        const formValues = this.getFormValues();
        const suggestion = this.findBestQuickPreset(formValues);

        if (!suggestion) {
            this.showToast('No suitable suggestion found yet.', 'info');
            return;
        }

        const appliedFields = this.applyPresetValues(suggestion, true);

        if (!appliedFields.length) {
            this.showToast('Everything already looks complete!', 'info');
            return;
        }

        this.generatePrompt();
        this.updateLyricDraftPreview();
        this.updateAdvancedPreview();
        this.updateProgressIndicator();

        this.showToast(`Filled ${appliedFields.length} fields using ${suggestion.name}.`, 'success');
    }

    findBestQuickPreset(currentValues) {
        let bestPreset = null;
        let bestScore = 0;

        this.quickPresets.forEach(preset => {
            const presetValues = preset.values || {};
            let score = 0;

            Object.entries(presetValues).forEach(([key, value]) => {
                const currentValue = currentValues[key];
                if (currentValue && currentValue === value) {
                    score += 2;
                } else if (!currentValue) {
                    score += 1;
                }
            });

            if (score > bestScore) {
                bestScore = score;
                bestPreset = preset;
            }
        });

        return bestPreset;
    }

    applyPresetValues(preset, fillOnlyEmpty = false) {
        if (!preset || !preset.values) return [];
        const applied = [];
        const deferredWorldFields = [];

        const setFieldValue = (key, value) => {
            if (!value) return;
            const element = document.getElementById(key);
            if (!element) return;

            if (fillOnlyEmpty && element.value) return;

            if (element.tagName === 'SELECT') {
                const optionIndex = Array.from(element.options).findIndex(opt => opt.value === value);
                if (optionIndex > -1) {
                    element.selectedIndex = optionIndex;
                    element.dispatchEvent(new Event('change'));
                    applied.push(key);
                }
            } else {
                element.value = value;
                element.dispatchEvent(new Event('input'));
                applied.push(key);
            }
        };

        Object.entries(preset.values).forEach(([key, value]) => {
            if (key.startsWith('world_') && key !== 'world_region') {
                deferredWorldFields.push({ key, value });
            } else {
                setFieldValue(key, value);
            }
        });

        if (deferredWorldFields.length) {
            setTimeout(() => {
                deferredWorldFields.forEach(({ key, value }) => setFieldValue(key, value));
            }, 200);
        }

        return applied;
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

    initPresetGallery() {
        if (!this.presetGalleryGrid) {
            return;
        }
        this.quickPresets = this.getQuickPresets();
        this.quickPresetFilter = 'All';
        this.quickPresetSearch = '';

        if (this.presetFilterContainer) {
            this.presetFilterContainer.innerHTML = '';
            const categories = ['All', ...new Set(this.quickPresets.map(p => p.category))];
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = `preset-filter-btn${category === 'All' ? ' active' : ''}`;
                btn.textContent = category;
                btn.dataset.filter = category;
                btn.addEventListener('click', () => {
                    this.quickPresetFilter = category;
                    Array.from(this.presetFilterContainer.children).forEach(child => child.classList.remove('active'));
                    btn.classList.add('active');
                    this.renderQuickPresets();
                });
                this.presetFilterContainer.appendChild(btn);
            });
        }

        if (this.presetSearchInput) {
            this.presetSearchInput.value = '';
            this.presetSearchInput.addEventListener('input', (e) => {
                clearTimeout(this.quickPresetSearchTimeout);
                const value = e.target.value.trim().toLowerCase();
                this.quickPresetSearchTimeout = setTimeout(() => {
                    this.quickPresetSearch = value;
                    this.renderQuickPresets();
                }, 200);
            });
        }

        this.renderQuickPresets();
    }

    renderQuickPresets() {
        if (!this.presetGalleryGrid) return;

        let presets = [...this.quickPresets];
        if (this.quickPresetFilter && this.quickPresetFilter !== 'All') {
            presets = presets.filter(preset => preset.category === this.quickPresetFilter);
        }
        if (this.quickPresetSearch) {
            presets = presets.filter(preset => {
                const haystack = `${preset.name} ${preset.description} ${(preset.tags || []).join(' ')}`.toLowerCase();
                return haystack.includes(this.quickPresetSearch);
            });
        }

        this.presetGalleryGrid.innerHTML = '';

        if (!presets.length) {
            if (this.presetGalleryEmpty) {
                this.presetGalleryEmpty.style.display = 'block';
            }
            return;
        }
        if (this.presetGalleryEmpty) {
            this.presetGalleryEmpty.style.display = 'none';
        }

        presets.forEach(preset => {
            const card = document.createElement('div');
            card.className = 'preset-card';

            const header = document.createElement('div');
            header.className = 'preset-card-header';

            const titleWrap = document.createElement('div');
            const title = document.createElement('h4');
            title.textContent = preset.name;
            const desc = document.createElement('p');
            desc.className = 'preset-card-description';
            desc.textContent = preset.description;
            titleWrap.appendChild(title);
            titleWrap.appendChild(desc);

            const category = document.createElement('span');
            category.className = 'preset-card-category';
            category.textContent = preset.category;

            header.appendChild(titleWrap);
            header.appendChild(category);
            card.appendChild(header);

            if (preset.tags && preset.tags.length) {
                const tagsWrap = document.createElement('div');
                tagsWrap.className = 'preset-card-tags';
                preset.tags.forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.className = 'preset-tag';
                    tagEl.textContent = tag;
                    tagsWrap.appendChild(tagEl);
                });
                card.appendChild(tagsWrap);
            }

            const footer = document.createElement('div');
            footer.className = 'preset-card-footer';

            const meta = document.createElement('span');
            meta.className = 'preset-card-meta';
            meta.textContent = preset.preview || '';

            const applyBtn = document.createElement('button');
            applyBtn.textContent = 'Apply';
            applyBtn.addEventListener('click', () => this.applyQuickPreset(preset.id));

            footer.appendChild(meta);
            footer.appendChild(applyBtn);
            card.appendChild(footer);

            this.presetGalleryGrid.appendChild(card);
        });
    }

    applyQuickPreset(presetId) {
        const preset = this.quickPresets.find(item => item.id === presetId);
        if (!preset) return;

        if (preset.values) {
            this.loadTemplate({ values: preset.values });
        }

        setTimeout(() => {
            if (preset.musicPrompt) {
                this.promptMusic.value = preset.musicPrompt;
            }
            if (preset.lyricsPrompt) {
                this.promptLyrics.value = preset.lyricsPrompt;
            }
            this.updateCharacterCounter();
            this.updateLyricDraftPreview();
            this.updateAdvancedPreview();
            this.updateProgressIndicator();
            this.showToast(`Quick preset "${preset.name}" loaded`, 'success');
        }, 350);
    }

    getQuickPresets() {
        return [
            {
                id: 'cinematic-epic',
                name: 'Epic Cinematic',
                category: 'Cinematic',
                description: 'Sweeping orchestra with pounding percussion and dramatic buildups.',
                preview: 'Epic orchestral score with soaring strings.',
                tags: ['dramatic', 'orchestral', 'film'],
                values: {
                    genre: 'Cinematic',
                    tempo: 'Very Slow (40-60 BPM)',
                    mood: 'Dramatic',
                    harmony: 'Minor',
                    lead: 'Violin',
                    accompaniment: 'Strings',
                    percussion: 'Cinematic Percussion',
                    bass: 'Deep Sub Bass',
                    mixing_style: 'Wide Stereo',
                    production_style: 'Cinematic'
                }
            },
            {
                id: 'lofi-dreams',
                name: 'Lo-fi Dreams',
                category: 'Electronic',
                description: 'Soft lo-fi hip hop for studying and late-night focus.',
                preview: 'Chill lo-fi beats with vinyl textures.',
                tags: ['lofi', 'chill', 'study'],
                values: {
                    genre: 'Lo-fi',
                    subgenre: 'Jazz Lo-fi',
                    tempo: 'Slow (60-80 BPM)',
                    mood: 'Calm',
                    harmony: 'Jazz Harmony',
                    lead: 'Electric Piano',
                    bass: 'Warm Analog Bass',
                    percussion: 'Minimal Percussion',
                    mixing_style: 'Lo-fi Aesthetic',
                    production_style: 'Bedroom Production'
                }
            },
            {
                id: 'turkish-trad',
                name: 'Turkish Tradition',
                category: 'World',
                description: 'Authentic Turkish makam arrangement with oud-led melodies.',
                preview: 'Traditional Hicaz makam with hand percussion.',
                tags: ['makam', 'world', 'acoustic'],
                values: {
                    turkish_music_style: 'Classical Turkish Music',
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
                id: 'afrobeats-sunset',
                name: 'Afrobeats Sunset',
                category: 'World',
                description: 'Feel-good Afrobeats groove with vibrant percussion.',
                preview: 'Upbeat Afrobeats with syncopated drums.',
                tags: ['afrobeats', 'dance', 'joyful'],
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
                id: 'indie-sunrise',
                name: 'Indie Sunrise',
                category: 'Pop',
                description: 'Organic indie pop with jangly guitars and uplifting mood.',
                preview: 'Indie pop anthem with guitars and strings.',
                tags: ['indie', 'uplifting', 'organic'],
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
            },
            {
                id: 'techno-industrial',
                name: 'Industrial Techno',
                category: 'Electronic',
                description: 'Dark techno with relentless kick and metallic textures.',
                preview: 'Driving techno groove built for clubs.',
                tags: ['techno', 'dark', 'club'],
                values: {
                    genre: 'Electronic',
                    subgenre: 'Techno',
                    tempo: 'Upbeat (120-140 BPM)',
                    mood: 'Intense',
                    rhythm: '4/4 Steady',
                    percussion: 'Electronic Drums',
                    bass: 'Distorted Bass',
                    lead: 'Synthesizer',
                    mixing_style: 'Modern Digital',
                    production_style: 'Professional Mix'
                }
            },
            {
                id: 'ambient-haze',
                name: 'Ambient Haze',
                category: 'Electronic',
                description: 'Ethereal pads and evolving textures for meditation.',
                preview: 'Floating ambient drones and pulses.',
                tags: ['ambient', 'relax', 'meditation'],
                values: {
                    genre: 'Ambient',
                    tempo: 'Very Slow (40-60 BPM)',
                    mood: 'Peaceful',
                    harmony: 'Modal',
                    lead: 'Synth Pad',
                    accompaniment: 'Atmospheric Textures',
                    percussion: 'No Percussion',
                    mixing_style: 'Wide Stereo',
                    production_style: 'Studio Recorded'
                }
            },
            {
                id: 'latin-groove',
                name: 'Latin Groove',
                category: 'World',
                description: 'Energetic Latin fusion with brass hits and percussion.',
                preview: 'Danceable Latin groove with lively horns.',
                tags: ['latin', 'dance', 'brass'],
                values: {
                    genre: 'World',
                    world_region: 'Latin America',
                    world_tradition: 'Afro-Cuban',
                    world_instruments: 'Trumpet Section',
                    tempo: 'Medium (100-120 BPM)',
                    mood: 'Festive',
                    percussion: 'Hand Percussion',
                    mixing_style: 'Bright and Crisp',
                    production_style: 'Live Performance'
                }
            }
        ];
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
            const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
            if (isInputFocused) return;

            const isCmd = e.metaKey;
            const isCtrl = e.ctrlKey;
            const modifierPressed = isCmd || isCtrl;

            // Special case: Cmd/Ctrl + Shift + R should be left to the browser (hard refresh)
            if (modifierPressed && e.shiftKey && e.key.toLowerCase() === 'r') {
                return;
            }

            // Don't interfere with any other Shift + modifier combinations
            if (modifierPressed && e.shiftKey) {
                return;
            }

            if (modifierPressed) {
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
                        if (e.altKey) {
                        e.preventDefault();
                        this.generateRandomPrompt();
                        }
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
                if (this.shareDropdown && this.shareDropdown.classList.contains('active')) {
                    this.shareDropdown.classList.remove('active');
                }
                if (this.feedbackModal && this.feedbackModal.classList.contains('active')) {
                    this.closeFeedbackModalFunc();
                }
                if (this.shareModal && this.shareModal.classList.contains('active')) {
                    this.closeShareModalFunc();
                }
                if (this.visualEditorModal && this.visualEditorModal.classList.contains('active')) {
                    this.closeVisualEditorFunc();
                }
            }
        });
    }

    // ==================== FEEDBACK SYSTEM ====================
    
    initFeedbackSystem() {
        // Check if feedback already given
        const feedbackGiven = localStorage.getItem('sunoFeedbackGiven');
        if (feedbackGiven === 'true') {
            this.feedbackGiven = true;
        }

        // Load usage count
        const storedCount = localStorage.getItem('sunoUsageCount');
        this.usageCount = storedCount ? parseInt(storedCount) : 0;

        // Event listeners for feedback modal
        if (this.closeFeedbackModal) {
            this.closeFeedbackModal.addEventListener('click', () => this.closeFeedbackModalFunc());
        }

        if (this.feedbackOptions && this.feedbackOptions.length > 0) {
            this.feedbackOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    // Remove previous selection
                    this.feedbackOptions.forEach(opt => opt.classList.remove('selected'));
                    // Add selection to clicked option
                    e.target.classList.add('selected');
                    const rating = e.target.dataset.rating;
                    this.handleFeedbackRating(rating);
                });
            });
        }

        if (this.submitFeedbackBtn) {
            this.submitFeedbackBtn.addEventListener('click', () => this.submitFeedback());
        }

        if (this.subtleFeedbackBtn) {
            this.subtleFeedbackBtn.addEventListener('click', () => this.showFeedbackModal());
        }

        // Collect silent usage analytics on page unload
        this.setupExitIntent();
    }

    trackUsage() {
        // Increment usage count silently
        this.usageCount++;
        localStorage.setItem('sunoUsageCount', this.usageCount.toString());

        // Track session time
        const sessionTime = Date.now() - this.sessionStartTime;
        const storedSessionTime = localStorage.getItem('sunoTotalSessionTime');
        const totalSessionTime = storedSessionTime ? parseInt(storedSessionTime) : 0;
        localStorage.setItem('sunoTotalSessionTime', (totalSessionTime + sessionTime).toString());

        // Check if we should show feedback
        this.checkFeedbackTriggers();
    }

    trackCopyAction() {
        this.promptCopiedCount++;
        localStorage.setItem('sunoPromptCopiedCount', this.promptCopiedCount.toString());
        const analytics = this.getAnalytics();
        analytics.copiedCount = (analytics.copiedCount || 0) + 1;
        this.saveAnalytics(analytics);
        this.checkFeedbackTriggers();
    }

    trackSaveAction() {
        this.promptSavedCount++;
        localStorage.setItem('sunoPromptSavedCount', this.promptSavedCount.toString());
        const analytics = this.getAnalytics();
        analytics.savedCount = (analytics.savedCount || 0) + 1;
        this.saveAnalytics(analytics);
        this.checkFeedbackTriggers();
    }

    checkFeedbackTriggers() {
        return; // Inline card replaces popup triggers
    }

    setupExitIntent() {
        window.addEventListener('beforeunload', () => {
            this.collectSilentFeedback();
        });
    }

    collectSilentFeedback() {
        // Collect usage data silently without bothering user
        const feedbackData = {
            usageCount: this.usageCount,
            promptCopiedCount: this.promptCopiedCount,
            promptSavedCount: this.promptSavedCount,
            sessionTime: Date.now() - this.sessionStartTime,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };

        // Send to analytics or your backend (you can implement this)
        this.sendFeedbackData(feedbackData, 'silent');
    }

    checkAndShowSubtleFeedback() {
        return;
    }

    showFeedbackModal() {
        if (this.feedbackGiven || !this.feedbackModal) return;
        
        this.feedbackModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Hide subtle feedback button
        if (this.subtleFeedback) {
            this.subtleFeedback.style.display = 'none';
        }

        // Close on background click
        this.feedbackModal.addEventListener('click', (e) => {
            if (e.target === this.feedbackModal) {
                this.closeFeedbackModalFunc();
            }
        });
    }

    closeFeedbackModalFunc() {
        if (this.feedbackModal) {
            this.feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleFeedbackRating(rating) {
        // Show comment field for ratings 1-3 (negative feedback)
        if (rating <= 3) {
            const commentDiv = this.feedbackComment ? this.feedbackComment.parentElement : null;
            if (commentDiv) {
                commentDiv.style.display = 'block';
            }
        } else {
            // For positive ratings (4-5), submit after a short delay
            setTimeout(() => {
                this.submitFeedback(rating);
            }, 500);
            const commentDiv = this.feedbackComment ? this.feedbackComment.parentElement : null;
            if (commentDiv) {
                commentDiv.style.display = 'none';
            }
        }
    }

    submitFeedback(rating = null) {
        const selectedRating = rating || (this.feedbackModal ? this.feedbackModal.querySelector('.feedback-option.selected')?.dataset.rating : null);
        const comment = this.feedbackComment ? this.feedbackComment.value : '';

        if (!selectedRating) {
            const selected = this.feedbackModal ? this.feedbackModal.querySelector('.feedback-option.selected') : null;
            if (!selected) {
                this.showToast('Please select a rating.', 'info');
                return;
            }
        }

        const feedbackData = {
            rating: selectedRating || rating,
            comment: comment,
            usageCount: this.usageCount,
            promptCopiedCount: this.promptCopiedCount,
            promptSavedCount: this.promptSavedCount,
            sessionTime: Date.now() - this.sessionStartTime,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };

        // Mark feedback as given
        this.feedbackGiven = true;
        localStorage.setItem('sunoFeedbackGiven', 'true');

        // Send feedback data
        this.sendFeedbackData(feedbackData, 'explicit');

        // Close modal and show thank you
        this.closeFeedbackModalFunc();
        this.showThankYouMessage();
    }

    sendFeedbackData(data, type) {
        // You can implement this to send to your backend/analytics
        // For now, we'll store locally and you can collect later
        
        const storedFeedback = localStorage.getItem('sunoFeedbackData');
        const feedbackArray = storedFeedback ? JSON.parse(storedFeedback) : [];
        
        feedbackArray.push({
            ...data,
            type: type // 'silent' or 'explicit'
        });
        
        localStorage.setItem('sunoFeedbackData', JSON.stringify(feedbackArray));

        // Optional: Send to Google Analytics or your backend
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feedback_submitted', {
                'rating': data.rating,
                'type': type,
                'usage_count': data.usageCount
            });
        }

        // Optional: Send to your backend API
        // fetch('/api/feedback', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // }).catch(err => console.error('Feedback send error:', err));
    }

    showThankYouMessage() {
        // Show a subtle thank you message
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.textContent = 'Thank you! Your feedback has been saved. 🙏';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 12px 20px;
            box-shadow: var(--shadow-md);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    initInlineFeedbackCard() {
        if (!this.feedbackInlineCard) return;

        const inlineHidden = localStorage.getItem('sunoInlineFeedbackHidden');
        if (inlineHidden === 'true') {
            this.feedbackInlineCard.style.display = 'none';
            return;
        }

        if (this.feedbackGiven) {
            this.showInlineThankYou();
            return;
        }

        if (this.feedbackInlineOptions) {
            this.feedbackInlineOptions.forEach(option => {
                option.addEventListener('click', () => this.handleInlineFeedbackRating(option));
            });
        }

        if (this.feedbackInlineSubmit) {
            this.feedbackInlineSubmit.addEventListener('click', () => this.submitInlineFeedback());
        }

        if (this.dismissFeedbackInline) {
            this.dismissFeedbackInline.addEventListener('click', () => {
                this.feedbackInlineCard.style.display = 'none';
                localStorage.setItem('sunoInlineFeedbackHidden', 'true');
            });
        }
    }

    initWhatsNewModal() {
        if (this.whatsNewToggle) {
            this.whatsNewToggle.addEventListener('click', () => this.openWhatsNewModal());
        }
        if (this.closeWhatsNewModalBtn) {
            this.closeWhatsNewModalBtn.addEventListener('click', () => this.closeWhatsNewModal());
        }
        if (this.whatsNewModal) {
            this.whatsNewModal.addEventListener('click', (e) => {
                if (e.target === this.whatsNewModal) {
                    this.closeWhatsNewModal();
                }
            });
        }
    }

    openWhatsNewModal() {
        if (this.whatsNewModal) {
            this.whatsNewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeWhatsNewModal() {
        if (this.whatsNewModal) {
            this.whatsNewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleInlineFeedbackRating(button) {
        if (!button) return;
        const rating = parseInt(button.dataset.rating, 10);
        this.inlineFeedbackRating = rating;

        if (this.feedbackInlineOptions) {
            this.feedbackInlineOptions.forEach(option => option.classList.remove('selected'));
        }
        button.classList.add('selected');

        if (this.feedbackInlineComment) {
            if (rating <= 3) {
                this.feedbackInlineComment.style.display = 'flex';
            } else {
                this.feedbackInlineComment.style.display = 'none';
                if (this.feedbackInlineInput) {
                    this.feedbackInlineInput.value = '';
                }
                setTimeout(() => this.submitInlineFeedback(), 400);
            }
        }
    }

    submitInlineFeedback() {
        if (this.feedbackGiven) {
            this.showInlineThankYou();
            return;
        }
        if (!this.inlineFeedbackRating) {
            this.showToast('Please select a rating first.', 'info');
            return;
        }

        const comment = this.feedbackInlineInput ? this.feedbackInlineInput.value.trim() : '';
        const feedbackData = {
            rating: this.inlineFeedbackRating,
            comment,
            usageCount: this.usageCount,
            promptCopiedCount: this.promptCopiedCount,
            promptSavedCount: this.promptSavedCount,
            sessionTime: Date.now() - this.sessionStartTime,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        };

        this.feedbackGiven = true;
        localStorage.setItem('sunoFeedbackGiven', 'true');
        this.sendFeedbackData(feedbackData, 'inline');
        this.showInlineThankYou();
    }

    showInlineThankYou() {
        if (!this.feedbackInlineCard) return;
        this.feedbackInlineCard.innerHTML = `
            <div class="feedback-inline-thanks">
                <h4>Thank you! 🙏</h4>
                <p class="feedback-inline-text">Your feedback helps me improve the builder.</p>
            </div>
        `;
    }

    // ==================== SOCIAL SHARE BUTTONS ====================
    
    initSocialShareButtons() {
        const currentUrl = encodeURIComponent(window.location.href);
        const siteTitle = encodeURIComponent('Suno Prompt Builder - Create Professional Music Prompts for SUNO AI');
        const siteDescription = encodeURIComponent('Create professional music prompts for SUNO AI with customizable styles, instruments, and lyrics guidance.');
        
        // Twitter/X
        const twitterLink = document.getElementById('share-twitter-link');
        if (twitterLink) {
            twitterLink.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${siteTitle}`;
        }
        
        // Facebook
        const facebookLink = document.getElementById('share-facebook-link');
        if (facebookLink) {
            facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        }
        
        // Instagram (just link to profile, can't share URL directly)
        const instagramLink = document.getElementById('share-instagram-link');
        if (instagramLink) {
            // Update this with your Instagram profile URL
            instagramLink.href = 'https://www.instagram.com/';
        }
        
        // TikTok (just link to profile, can't share URL directly)
        const tiktokLink = document.getElementById('share-tiktok-link');
        if (tiktokLink) {
            // Update this with your TikTok profile URL
            tiktokLink.href = 'https://www.tiktok.com/';
        }
        
        // Reddit
        const redditLink = document.getElementById('share-reddit-link');
        if (redditLink) {
            redditLink.href = `https://www.reddit.com/submit?url=${currentUrl}&title=${siteTitle}`;
        }
        
        // LinkedIn
        const linkedinLink = document.getElementById('share-linkedin-link');
        if (linkedinLink) {
            linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
        }
        
        // YouTube (just link to channel, can't share URL directly)
        const youtubeLink = document.getElementById('share-youtube-link');
        if (youtubeLink) {
            // Update this with your YouTube channel URL
            youtubeLink.href = 'https://www.youtube.com/';
        }
    }

    // ==================== SHARE SYSTEM ====================
    
    initShareSystem() {
        // Close share dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.shareDropdown) {
                this.shareDropdown = document.querySelector('.share-dropdown');
            }
            if (this.shareDropdown && this.shareBtn && 
                !this.shareBtn.contains(e.target) && 
                !this.shareDropdown.contains(e.target)) {
                this.shareDropdown.classList.remove('active');
            }
        });
        
        // Close share modal when clicking outside
        if (this.shareModal) {
            this.shareModal.addEventListener('click', (e) => {
                if (e.target === this.shareModal) {
                    this.closeShareModalFunc();
                }
            });
        }
    }

    toggleShareDropdown(e) {
        if (e) {
            e.stopPropagation();
        }
        
        if (!this.shareDropdown) {
            this.shareDropdown = document.querySelector('.share-dropdown');
        }
        
        if (this.shareDropdown) {
            // Close export dropdown if open
            if (this.exportDropdown) {
                this.exportDropdown.classList.remove('active');
            }
            this.shareDropdown.classList.toggle('active');
        } else {
            console.error('Share dropdown not found');
        }
    }

    generateShareUrl() {
        const values = this.getFormValues();
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        // Create shareable data
        const shareData = {
            v: '1.0', // version
            m: musicPrompt || '',
            l: lyricsPrompt || '',
            d: values // form data
        };
        
        // Encode to base64 URL-safe string
        const encoded = btoa(JSON.stringify(shareData))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        
        const currentUrl = window.location.origin + window.location.pathname;
        return `${currentUrl}?share=${encoded}`;
    }

    showShareModal() {
        if (!this.shareModal) return;
        
        const shareUrl = this.generateShareUrl();
        if (this.shareUrlInput) {
            this.shareUrlInput.value = shareUrl;
        }
        
        this.shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close dropdown
        if (this.shareDropdown) {
            this.shareDropdown.classList.remove('active');
        }
    }

    closeShareModalFunc() {
        if (this.shareModal) {
            this.shareModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    async copyShareUrl() {
        if (this.shareUrlInput) {
            await this.copyToClipboard(this.shareUrlInput.value, 'Share link copied!');
            
            // Show feedback
            if (this.copyShareUrlBtn) {
                const originalText = this.copyShareUrlBtn.textContent;
                this.copyShareUrlBtn.textContent = 'Copied!';
                this.copyShareUrlBtn.style.background = '#34C759';
                setTimeout(() => {
                    this.copyShareUrlBtn.textContent = originalText;
                    this.copyShareUrlBtn.style.background = '';
                }, 2000);
            }
        }
    }

    shareOnTwitter() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        const shareUrl = this.generateShareUrl();
        
        let text = 'Check out this Suno AI prompt I created!';
        if (musicPrompt) {
            const preview = musicPrompt.substring(0, 100);
            text += `\n\n${preview}${musicPrompt.length > 100 ? '...' : ''}`;
        }
        text += `\n\n${shareUrl}`;
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
        
        this.closeShareModalFunc();
        if (this.shareDropdown) {
            this.shareDropdown.classList.remove('active');
        }
    }

    shareOnFacebook() {
        const shareUrl = this.generateShareUrl();
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(facebookUrl, '_blank', 'width=550,height=420');
        
        this.closeShareModalFunc();
        if (this.shareDropdown) {
            this.shareDropdown.classList.remove('active');
        }
    }

    shareOnReddit() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        const shareUrl = this.generateShareUrl();
        
        let title = 'Suno AI Prompt - Check this out!';
        let text = '';
        if (musicPrompt) {
            text += `**Styles:**\n${musicPrompt}\n\n`;
        }
        if (lyricsPrompt) {
            text += `**Lyrics:**\n${lyricsPrompt}\n\n`;
        }
        text += `Created with Suno Prompt Builder: ${shareUrl}`;
        
        const redditUrl = `https://reddit.com/submit?title=${encodeURIComponent(title)}&text=${encodeURIComponent(text)}`;
        window.open(redditUrl, '_blank', 'width=750,height=600');
        
        this.closeShareModalFunc();
        if (this.shareDropdown) {
            this.shareDropdown.classList.remove('active');
        }
    }

    shareOnLinkedIn() {
        const shareUrl = this.generateShareUrl();
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(linkedinUrl, '_blank', 'width=550,height=420');
        
        this.closeShareModalFunc();
        if (this.shareDropdown) {
            this.shareDropdown.classList.remove('active');
        }
    }

    loadSharedPrompt() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = urlParams.get('share');
        
        if (!shareParam) return;
        
        try {
            // Decode from base64 URL-safe string
            const decoded = shareParam
                .replace(/-/g, '+')
                .replace(/_/g, '/');
            
            // Add padding if needed
            const padding = decoded.length % 4;
            const padded = padding ? decoded + '='.repeat(4 - padding) : decoded;
            
            const shareData = JSON.parse(atob(padded));
            
            if (shareData.d) {
                // Load form values
                Object.keys(shareData.d).forEach(key => {
                    const field = document.querySelector(`[id="${key}"]`);
                    if (field && shareData.d[key]) {
                        field.value = shareData.d[key];
                    }
                });
            }
            
            // Load prompts
            if (shareData.m && this.promptMusic) {
                this.promptMusic.value = shareData.m;
            }
            if (shareData.l && this.promptLyrics) {
                this.promptLyrics.value = shareData.l;
            }
            
            // Update character counters
            this.updateCharacterCounter();
            this.updateProgressIndicator();
            
            // Show notification
            this.showNotification('Shared prompt loaded!', 'success');
            
            // Clean URL (remove share parameter)
            const newUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            
        } catch (error) {
            console.error('Error loading shared prompt:', error);
            this.showNotification('Failed to load shared prompt.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        this.showToast(message, type);
    }

    showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast-notification');
        existingToasts.forEach(toast => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        });

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
        `;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // ==================== VISUAL EDITOR ====================
    
    initVisualEditor() {
        if (!this.visualEditorToggle) return;
        
        // Load saved settings
        this.loadVisualSettings();
        
        // Event listeners
        this.visualEditorToggle.addEventListener('click', () => this.showVisualEditor());
        if (this.closeVisualEditor) {
            this.closeVisualEditor.addEventListener('click', () => this.closeVisualEditorFunc());
        }
        if (this.saveVisualSettings) {
            this.saveVisualSettings.addEventListener('click', () => this.saveVisualSettingsFunc());
        }
        if (this.resetVisualSettings) {
            this.resetVisualSettings.addEventListener('click', () => this.resetVisualSettingsFunc());
        }
        
        // Color inputs
        const colorInputs = ['color-bg-primary', 'color-bg-secondary', 'color-text-primary', 'color-accent'];
        colorInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', (e) => this.applyColorChange(id, e.target.value));
            }
        });
        
        // Range inputs
        const rangeInputs = [
            { id: 'font-title-size', property: '--font-title-size', suffix: 'px' },
            { id: 'font-body-size', property: '--font-body-size', suffix: 'px' },
            { id: 'border-radius', property: '--radius', suffix: 'px' },
            { id: 'card-padding', property: '--card-padding', suffix: 'px' },
            { id: 'element-gap', property: '--element-gap', suffix: 'px' }
        ];
        
        rangeInputs.forEach(({ id, property, suffix }) => {
            const input = document.getElementById(id);
            const valueDisplay = document.getElementById(`${id}-value`);
            if (input) {
                input.addEventListener('input', (e) => {
                    const value = e.target.value;
                    if (valueDisplay) valueDisplay.textContent = value + suffix;
                    document.documentElement.style.setProperty(property, value + suffix);
                });
            }
        });
        
        // Close modal on outside click
        if (this.visualEditorModal) {
            this.visualEditorModal.addEventListener('click', (e) => {
                if (e.target === this.visualEditorModal) {
                    this.closeVisualEditorFunc();
                }
            });
        }
    }
    
    showVisualEditor() {
        if (this.visualEditorModal) {
            this.visualEditorModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeVisualEditorFunc() {
        if (this.visualEditorModal) {
            this.visualEditorModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    applyColorChange(inputId, value) {
        const colorMap = {
            'color-bg-primary': '--bg-primary',
            'color-bg-secondary': '--bg-secondary',
            'color-text-primary': '--text-primary',
            'color-accent': '--accent-color'
        };
        
        const cssVar = colorMap[inputId];
        if (cssVar) {
            document.documentElement.style.setProperty(cssVar, value);
        }
    }
    
    saveVisualSettings() {
        const settings = {
            colors: {
                bgPrimary: document.getElementById('color-bg-primary')?.value || '#F5F5F7',
                bgSecondary: document.getElementById('color-bg-secondary')?.value || '#FFFFFF',
                textPrimary: document.getElementById('color-text-primary')?.value || '#000000',
                accent: document.getElementById('color-accent')?.value || '#007AFF'
            },
            typography: {
                titleSize: document.getElementById('font-title-size')?.value || '36',
                bodySize: document.getElementById('font-body-size')?.value || '15',
                borderRadius: document.getElementById('border-radius')?.value || '12'
            },
            spacing: {
                cardPadding: document.getElementById('card-padding')?.value || '24',
                elementGap: document.getElementById('element-gap')?.value || '16'
            }
        };
        
        localStorage.setItem('sunoVisualSettings', JSON.stringify(settings));
        this.showNotification('Visual settings saved!', 'success');
        this.closeVisualEditorFunc();
    }
    
    saveVisualSettingsFunc() {
        this.saveVisualSettings();
    }
    
    loadVisualSettings() {
        const saved = localStorage.getItem('sunoVisualSettings');
        if (!saved) return;
        
        try {
            const settings = JSON.parse(saved);
            
            // Apply colors
            if (settings.colors) {
                document.getElementById('color-bg-primary').value = settings.colors.bgPrimary;
                document.getElementById('color-bg-secondary').value = settings.colors.bgSecondary;
                document.getElementById('color-text-primary').value = settings.colors.textPrimary;
                document.getElementById('color-accent').value = settings.colors.accent;
                
                this.applyColorChange('color-bg-primary', settings.colors.bgPrimary);
                this.applyColorChange('color-bg-secondary', settings.colors.bgSecondary);
                this.applyColorChange('color-text-primary', settings.colors.textPrimary);
                this.applyColorChange('color-accent', settings.colors.accent);
            }
            
            // Apply typography
            if (settings.typography) {
                document.getElementById('font-title-size').value = settings.typography.titleSize;
                document.getElementById('font-title-size-value').textContent = settings.typography.titleSize + 'px';
                document.getElementById('font-body-size').value = settings.typography.bodySize;
                document.getElementById('font-body-size-value').textContent = settings.typography.bodySize + 'px';
                document.getElementById('border-radius').value = settings.typography.borderRadius;
                document.getElementById('border-radius-value').textContent = settings.typography.borderRadius + 'px';
                
                document.documentElement.style.setProperty('--font-title-size', settings.typography.titleSize + 'px');
                document.documentElement.style.setProperty('--font-body-size', settings.typography.bodySize + 'px');
                document.documentElement.style.setProperty('--radius', settings.typography.borderRadius + 'px');
            }
            
            // Apply spacing
            if (settings.spacing) {
                document.getElementById('card-padding').value = settings.spacing.cardPadding;
                document.getElementById('card-padding-value').textContent = settings.spacing.cardPadding + 'px';
                document.getElementById('element-gap').value = settings.spacing.elementGap;
                document.getElementById('element-gap-value').textContent = settings.spacing.elementGap + 'px';
                
                document.documentElement.style.setProperty('--card-padding', settings.spacing.cardPadding + 'px');
                document.documentElement.style.setProperty('--element-gap', settings.spacing.elementGap + 'px');
            }
            
        } catch (error) {
            console.error('Error loading visual settings:', error);
        }
    }
    
    resetVisualSettingsFunc() {
        if (confirm('Reset all visual settings to default?')) {
            localStorage.removeItem('sunoVisualSettings');
            location.reload();
        }
    }

    // ==================== SEARCH SYSTEM ====================
    
    initSearch() {
        if (!this.settingsSearch) return;
        
        let searchTimeout;
        
        this.settingsSearch.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.toLowerCase().trim();
            
            if (query) {
                this.clearSearchBtn.style.display = 'block';
                searchTimeout = setTimeout(() => {
                    this.filterSettings(query);
                }, 300);
            } else {
                this.clearSearchBtn.style.display = 'none';
                this.clearSearch();
            }
        });
        
        if (this.clearSearchBtn) {
            this.clearSearchBtn.addEventListener('click', () => {
                this.settingsSearch.value = '';
                this.clearSearchBtn.style.display = 'none';
                this.clearSearch();
            });
        }
        
        // Keyboard shortcut: Ctrl+F or Cmd+F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
                this.settingsSearch.focus();
            }
        });
    }
    
    filterSettings(query) {
        const sections = document.querySelectorAll('.form-section');
        let visibleCount = 0;
        
        sections.forEach(section => {
            const sectionTitle = section.querySelector('.form-section-header h3')?.textContent.toLowerCase() || '';
            const fields = section.querySelectorAll('select, input, textarea, label');
            let hasMatch = false;
            
            // Check section title
            if (sectionTitle.includes(query)) {
                hasMatch = true;
            }
            
            // Check field labels and options
            fields.forEach(field => {
                if (field.tagName === 'LABEL') {
                    const labelText = field.textContent.toLowerCase();
                    if (labelText.includes(query)) {
                        hasMatch = true;
                    }
                } else if (field.tagName === 'SELECT') {
                    const options = Array.from(field.options);
                    const matchingOptions = options.filter(opt => 
                        opt.text.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query)
                    );
                    if (matchingOptions.length > 0) {
                        hasMatch = true;
                    }
                }
            });
            
            if (hasMatch) {
                section.style.display = '';
                visibleCount++;
            } else {
                section.style.display = 'none';
            }
        });
        
        // Show message if no results
        if (visibleCount === 0) {
            this.showToast('No settings found matching your search.', 'info');
        }
    }
    
    clearSearch() {
        const sections = document.querySelectorAll('.form-section');
        sections.forEach(section => {
            section.style.display = '';
        });
    }

    // ==================== FAVORITES SYSTEM ====================
    
    initFavorites() {
        // Add filter button to history header when history tab is shown
        const historyTab = document.querySelector('[data-tab="history"]');
        if (historyTab) {
            historyTab.addEventListener('click', () => {
                setTimeout(() => {
                    const historyHeader = document.querySelector('.history-header');
                    if (historyHeader && !document.getElementById('filter-favorites-btn')) {
                        const filterBtn = document.createElement('button');
                        filterBtn.id = 'filter-favorites-btn';
                        filterBtn.className = 'btn-small btn-secondary';
                        filterBtn.textContent = 'Show Favorites';
                        filterBtn.title = 'Filter to show only favorite prompts';
                        filterBtn.addEventListener('click', () => this.toggleFavoritesFilter());
                        historyHeader.insertBefore(filterBtn, historyHeader.firstChild);
                    }
                }, 100);
            });
            
            // Also add on initial load if history tab is active
            if (historyTab.classList.contains('active')) {
                setTimeout(() => {
                    const historyHeader = document.querySelector('.history-header');
                    if (historyHeader && !document.getElementById('filter-favorites-btn')) {
                        const filterBtn = document.createElement('button');
                        filterBtn.id = 'filter-favorites-btn';
                        filterBtn.className = 'btn-small btn-secondary';
                        filterBtn.textContent = 'Show Favorites';
                        filterBtn.title = 'Filter to show only favorite prompts';
                        filterBtn.addEventListener('click', () => this.toggleFavoritesFilter());
                        historyHeader.insertBefore(filterBtn, historyHeader.firstChild);
                    }
                }, 500);
            }
        }
    }
    
    toggleFavoritesFilter() {
        const filterBtn = document.getElementById('filter-favorites-btn');
        const isFiltered = filterBtn?.classList.contains('active');
        
        if (isFiltered) {
            filterBtn.classList.remove('active');
            filterBtn.textContent = 'Show Favorites';
            this.loadHistory();
        } else {
            filterBtn.classList.add('active');
            filterBtn.textContent = 'Show All';
            this.loadHistory(true); // Pass true to show only favorites
        }
    }
    
    loadHistory(showFavoritesOnly = false) {
        const history = this.getHistory();
        this.historyList.innerHTML = '';

        if (history.length === 0) {
            this.historyEmpty.style.display = 'flex';
            return;
        }

        this.historyEmpty.style.display = 'none';

        // Filter favorites if needed
        let filteredHistory = history;
        if (showFavoritesOnly) {
            filteredHistory = history.filter(item => item.favorite);
            if (filteredHistory.length === 0) {
                this.historyEmpty.style.display = 'flex';
                this.historyEmpty.innerHTML = `
                    <p>No favorite prompts yet.</p>
                    <p class="history-empty-sub">Click the star icon on any prompt to favorite it.</p>
                `;
                return;
            }
        }

        // Sort: favorites first, then by date
        const sortedHistory = [...filteredHistory].sort((a, b) => {
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
                    <span class="history-item-date">${item.date} ${item.time || ''}</span>
                    <div class="history-item-actions">
                        <button class="history-item-btn favorite ${item.favorite ? 'active' : ''}" 
                                data-action="favorite" title="${item.favorite ? 'Remove from favorites' : 'Add to favorites'}">
                            ${item.favorite ? '⭐' : '☆'}
                        </button>
                        <button class="history-item-btn" data-action="use" title="Use this prompt">Use</button>
                        <button class="history-item-btn" data-action="copy" title="Copy prompt">Copy</button>
                        <button class="history-item-btn" data-action="delete" title="Delete">×</button>
                    </div>
                </div>
                <div class="history-item-preview">${this.escapeHtml(preview)}</div>
            `;
            
            historyItem.addEventListener('click', (e) => {
                if (!e.target.closest('.history-item-actions')) {
                    const musicPrompt = item.prompt.includes('Styles:') ? item.prompt.split('Lyrics:')[0].replace('Styles:', '').trim() : item.prompt;
                    const lyricsPrompt = item.prompt.includes('Lyrics:') ? item.prompt.split('Lyrics:')[1].trim() : '';
                    if (this.promptMusic) this.promptMusic.value = musicPrompt;
                    if (this.promptLyrics) this.promptLyrics.value = lyricsPrompt;
                    this.updateCharacterCounter();
                }
            });

            // Attach event listeners
            const buttons = historyItem.querySelectorAll('.history-item-btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const action = button.dataset.action;
                    this.handleHistoryAction(action, item, button);
                });
            });

            this.historyList.appendChild(historyItem);
        });
    }

    // ==================== QUALITY SCORE (already added above) ====================

    // ==================== HISTORY SEARCH & FILTERING ====================
    
    initHistorySearch() {
        const historySearchInput = document.getElementById('history-search-input');
        const historyFilters = document.querySelectorAll('#history-filters .filter-tag');
        
        if (historySearchInput) {
            let searchTimeout;
            historySearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterHistory(e.target.value);
                }, 300);
            });
        }

        if (historyFilters.length > 0) {
            historyFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    historyFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    this.filterHistoryByDate(filter.dataset.filter);
                });
            });
        }
    }

    filterHistory(searchTerm) {
        const historyItems = document.querySelectorAll('.history-item');
        let visibleCount = 0;
        
        historyItems.forEach(item => {
            const preview = item.querySelector('.history-item-preview').textContent.toLowerCase();
            const date = item.querySelector('.history-item-date').textContent.toLowerCase();
            
            if (preview.includes(searchTerm.toLowerCase()) || date.includes(searchTerm.toLowerCase())) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        if (visibleCount === 0 && searchTerm) {
            this.historyEmpty.style.display = 'block';
            this.historyEmpty.innerHTML = `
                <p>No prompts found matching "${searchTerm}"</p>
            `;
        } else {
            this.historyEmpty.style.display = 'none';
        }
    }

    filterHistoryByDate(filter) {
        const history = this.getHistory();
        const now = new Date();
        const filtered = history.filter(item => {
            const itemDate = new Date(item.date);
            switch(filter) {
                case 'today':
                    return itemDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return itemDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return itemDate >= monthAgo;
                default:
                    return true;
            }
        });
        this.renderFilteredHistory(filtered);
    }

    renderFilteredHistory(filtered) {
        this.historyList.innerHTML = '';
        if (filtered.length === 0) {
            this.historyEmpty.style.display = 'block';
            return;
        }
        this.historyEmpty.style.display = 'none';
        filtered.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.dataset.id = item.id;
            const preview = item.prompt.length > 100 ? item.prompt.substring(0, 100) + '...' : item.prompt;
            historyItem.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-date">${item.date} ${item.time || ''}</span>
                    <div class="history-item-actions">
                        <button class="history-item-btn favorite ${item.favorite ? 'active' : ''}" data-action="favorite">${item.favorite ? '⭐' : '☆'}</button>
                        <button class="history-item-btn" data-action="use">Use</button>
                        <button class="history-item-btn" data-action="copy">Copy</button>
                        <button class="history-item-btn" data-action="delete">×</button>
                    </div>
                </div>
                <div class="history-item-preview">${this.escapeHtml(preview)}</div>
            `;
            const buttons = historyItem.querySelectorAll('.history-item-btn');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    this.handleHistoryAction(button.dataset.action, item, button);
                });
            });
            this.historyList.appendChild(historyItem);
        });
    }

    // ==================== COMMUNITY FEATURES ====================
    
    initCommunityFeatures() {
        const shareToCommunityBtn = document.getElementById('share-to-community-btn');
        const communitySearchInput = document.getElementById('community-search-input');
        const communityFilters = document.querySelectorAll('#community-filters .filter-tag');
        
        if (shareToCommunityBtn) {
            shareToCommunityBtn.addEventListener('click', () => this.sharePresetToCommunity());
        }

        if (communitySearchInput) {
            let searchTimeout;
            communitySearchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filterCommunityPresets(e.target.value);
                }, 300);
            });
        }

        if (communityFilters.length > 0) {
            communityFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    communityFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    this.filterCommunityByType(filter.dataset.filter);
                });
            });
        }

        this.loadCommunityPresets();
    }

    sharePresetToCommunity() {
        const currentData = this.collectFormData();
        if (!currentData.genre) {
            this.showToast('Please fill at least a genre before sharing.', 'error');
            return;
        }

        const presetName = prompt('Enter a name for this preset:');
        if (!presetName) return;

        const communityPresets = this.getCommunityPresets();
        const newPreset = {
            id: Date.now(),
            name: presetName,
            data: currentData,
            author: 'You',
            likes: 0,
            date: new Date().toISOString(),
            tags: this.extractTags(currentData)
        };

        communityPresets.push(newPreset);
        this.saveCommunityPresets(communityPresets);
        this.showToast('Preset shared to community!', 'success');
        this.loadCommunityPresets();
    }

    extractTags(data) {
        const tags = [];
        if (data.genre) tags.push(data.genre.toLowerCase());
        if (data.mood) tags.push(data.mood.toLowerCase());
        if (data.tempo) tags.push(data.tempo.toLowerCase());
        return tags;
    }

    getCommunityPresets() {
        const stored = localStorage.getItem('sunoCommunityPresets');
        return stored ? JSON.parse(stored) : [];
    }

    saveCommunityPresets(presets) {
        localStorage.setItem('sunoCommunityPresets', JSON.stringify(presets));
    }

    loadCommunityPresets() {
        const presets = this.getCommunityPresets();
        const listEl = document.getElementById('community-presets-list');
        const emptyEl = document.getElementById('community-empty');
        
        if (!listEl) return;

        if (presets.length === 0) {
            listEl.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'block';
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';
        listEl.innerHTML = presets.map(preset => `
            <div class="community-preset-item" data-id="${preset.id}">
                <div class="community-preset-header">
                    <h5>${this.escapeHtml(preset.name)}</h5>
                    <div class="community-preset-meta">
                        <span class="community-preset-author">by ${this.escapeHtml(preset.author)}</span>
                        <span class="community-preset-likes">❤️ ${preset.likes || 0}</span>
                    </div>
                </div>
                <div class="community-preset-tags">
                    ${preset.tags ? preset.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('') : ''}
                </div>
                <div class="community-preset-actions">
                    <button class="btn-small btn-primary" data-action="use">Use</button>
                    <button class="btn-small btn-secondary" data-action="like">❤️ Like</button>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-action="use"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetId = parseInt(btn.closest('.community-preset-item').dataset.id);
                const preset = presets.find(p => p.id === presetId);
                if (preset) this.applyPresetData(preset.data);
            });
        });

        listEl.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetId = parseInt(btn.closest('.community-preset-item').dataset.id);
                const updatedPresets = presets.map(p => {
                    if (p.id === presetId) {
                        p.likes = (p.likes || 0) + 1;
                    }
                    return p;
                });
                this.saveCommunityPresets(updatedPresets);
                this.loadCommunityPresets();
                this.showToast('Liked!', 'success');
            });
        });
    }

    filterCommunityPresets(searchTerm) {
        const presets = this.getCommunityPresets();
        const filtered = presets.filter(preset => {
            const searchLower = searchTerm.toLowerCase();
            return preset.name.toLowerCase().includes(searchLower) ||
                   preset.tags.some(tag => tag.toLowerCase().includes(searchLower));
        });
        this.renderFilteredCommunityPresets(filtered);
    }

    filterCommunityByType(type) {
        const presets = this.getCommunityPresets();
        let filtered = [...presets];
        
        if (type === 'popular') {
            filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        } else if (type === 'recent') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        this.renderFilteredCommunityPresets(filtered);
    }

    renderFilteredCommunityPresets(presets) {
        const listEl = document.getElementById('community-presets-list');
        if (!listEl) return;
        
        if (presets.length === 0) {
            listEl.innerHTML = '<p class="community-empty">No presets found.</p>';
            return;
        }
        
        listEl.innerHTML = presets.map(preset => `
            <div class="community-preset-item" data-id="${preset.id}">
                <div class="community-preset-header">
                    <h5>${this.escapeHtml(preset.name)}</h5>
                    <div class="community-preset-meta">
                        <span class="community-preset-author">by ${this.escapeHtml(preset.author)}</span>
                        <span class="community-preset-likes">❤️ ${preset.likes || 0}</span>
                    </div>
                </div>
                <div class="community-preset-tags">
                    ${preset.tags ? preset.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('') : ''}
                </div>
                <div class="community-preset-actions">
                    <button class="btn-small btn-primary" data-action="use">Use</button>
                    <button class="btn-small btn-secondary" data-action="like">❤️ Like</button>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-action="use"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetId = parseInt(btn.closest('.community-preset-item').dataset.id);
                const preset = presets.find(p => p.id === presetId);
                if (preset) this.applyPresetData(preset.data);
            });
        });

        listEl.querySelectorAll('[data-action="like"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetId = parseInt(btn.closest('.community-preset-item').dataset.id);
                const allPresets = this.getCommunityPresets();
                const updatedPresets = allPresets.map(p => {
                    if (p.id === presetId) {
                        p.likes = (p.likes || 0) + 1;
                    }
                    return p;
                });
                this.saveCommunityPresets(updatedPresets);
                this.loadCommunityPresets();
                this.showToast('Liked!', 'success');
            });
        });
    }

    // ==================== ANALYTICS ====================
    
    initAnalytics() {
        this.updateAnalytics();
    }

    updateAnalytics() {
        const history = this.getHistory();
        const presets = this.getPresets();
        const analytics = this.getAnalytics();

        // Update stats
        const totalPromptsEl = document.getElementById('stat-total-prompts');
        const savedPresetsEl = document.getElementById('stat-saved-presets');
        const copiedPromptsEl = document.getElementById('stat-copied-prompts');

        if (totalPromptsEl) totalPromptsEl.textContent = history.length;
        if (savedPresetsEl) savedPresetsEl.textContent = presets.length;
        if (copiedPromptsEl) copiedPromptsEl.textContent = analytics.copiedCount || 0;

        // Update popular combinations
        this.updatePopularCombinations(history);
        
        // Update trend analysis
        this.updateTrendAnalysis(history);
    }

    getAnalytics() {
        const stored = localStorage.getItem('sunoAnalytics');
        return stored ? JSON.parse(stored) : { copiedCount: 0, trends: [] };
    }

    saveAnalytics(analytics) {
        localStorage.setItem('sunoAnalytics', JSON.stringify(analytics));
    }

    updatePopularCombinations(history) {
        const combinations = {};
        history.forEach(item => {
            const data = item.data || {};
            const key = `${data.genre || 'Unknown'}-${data.mood || 'Unknown'}-${data.tempo || 'Unknown'}`;
            combinations[key] = (combinations[key] || 0) + 1;
        });

        const popular = Object.entries(combinations)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const popularEl = document.getElementById('popular-combinations');
        if (popularEl) {
            if (popular.length === 0) {
                popularEl.innerHTML = '<p class="trend-placeholder">No combinations yet</p>';
            } else {
                popularEl.innerHTML = popular.map(([key, count]) => {
                    const [genre, mood, tempo] = key.split('-');
                    return `
                        <div class="popular-combination-item">
                            <div class="combination-info">
                                <strong>${genre}</strong> • ${mood} • ${tempo}
                            </div>
                            <div class="combination-count">${count}x</div>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    updateTrendAnalysis(history) {
        const trendEl = document.getElementById('trend-analysis');
        if (!trendEl) return;

        if (history.length < 3) {
            trendEl.innerHTML = '<p class="trend-placeholder">Generate more prompts to see trends</p>';
            return;
        }

        const lastWeek = history.filter(item => {
            const itemDate = new Date(item.date);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return itemDate >= weekAgo;
        });

        const genres = {};
        lastWeek.forEach(item => {
            const genre = (item.data || {}).genre || 'Unknown';
            genres[genre] = (genres[genre] || 0) + 1;
        });

        const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0];
        
        trendEl.innerHTML = `
            <div class="trend-item">
                <p><strong>Most used genre this week:</strong> ${topGenre ? topGenre[0] : 'N/A'}</p>
                <p><strong>Prompts created this week:</strong> ${lastWeek.length}</p>
            </div>
        `;
    }

    // ==================== BATCH GENERATE ====================
    
    initBatchGenerate() {
        // Already initialized in attachEventListeners
    }

    showBatchModal() {
        const modal = document.getElementById('batch-generate-modal');
        if (!modal) return;
        
        const presets = this.getPresets();
        const selectionEl = document.getElementById('batch-presets-selection');
        
        if (selectionEl) {
            if (presets.length === 0) {
                selectionEl.innerHTML = '<p>No presets available. Save some presets first.</p>';
            } else {
                selectionEl.innerHTML = presets.map(preset => `
                    <label class="batch-preset-checkbox">
                        <input type="checkbox" value="${preset.id}" data-preset-id="${preset.id}">
                        <span>${this.escapeHtml(preset.name)}</span>
                    </label>
                `).join('');
            }
        }
        
        modal.style.display = 'flex';
    }

    closeBatchModal() {
        const modal = document.getElementById('batch-generate-modal');
        if (modal) modal.style.display = 'none';
    }

    startBatchGenerate() {
        const checkboxes = document.querySelectorAll('#batch-presets-selection input[type="checkbox"]:checked');
        const count = parseInt(document.getElementById('batch-count').value) || 5;
        
        if (checkboxes.length === 0) {
            this.showToast('Please select at least one preset.', 'error');
            return;
        }

        const presets = this.getPresets();
        const selectedPresets = Array.from(checkboxes).map(cb => {
            const presetId = parseInt(cb.dataset.presetId);
            return presets.find(p => p.id === presetId);
        }).filter(Boolean);

        const results = [];
        for (let i = 0; i < count; i++) {
            const randomPreset = selectedPresets[Math.floor(Math.random() * selectedPresets.length)];
            this.applyPresetData(randomPreset.data);
            this.generatePrompt();
            const musicPrompt = this.promptMusic.value;
            const lyricsPrompt = this.promptLyrics.value;
            results.push({
                id: Date.now() + i,
                preset: randomPreset.name,
                music: musicPrompt,
                lyrics: lyricsPrompt
            });
        }

        this.batchResults = results;
        this.displayBatchResults(results);
    }

    displayBatchResults(results) {
        const resultsEl = document.getElementById('batch-results');
        const resultsListEl = document.getElementById('batch-results-list');
        
        if (resultsEl) resultsEl.style.display = 'block';
        if (resultsListEl) {
            resultsListEl.innerHTML = results.map((result, index) => `
                <div class="batch-result-item">
                    <div class="batch-result-header">
                        <strong>#${index + 1} - ${this.escapeHtml(result.preset)}</strong>
                        <button class="btn-small btn-secondary" data-batch-copy="${index}">Copy</button>
                    </div>
                    <div class="batch-result-content">
                        <p><strong>Styles:</strong> ${this.escapeHtml(result.music.substring(0, 100))}${result.music.length > 100 ? '...' : ''}</p>
                        ${result.lyrics ? `<p><strong>Lyrics:</strong> ${this.escapeHtml(result.lyrics.substring(0, 50))}${result.lyrics.length > 50 ? '...' : ''}</p>` : ''}
                    </div>
                </div>
            `).join('');

            resultsListEl.querySelectorAll('[data-batch-copy]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.dataset.batchCopy);
                    const result = results[index];
                    const combined = `Styles: ${result.music}\n\nLyrics: ${result.lyrics || ''}`;
                    this.copyToClipboard(combined, 'Batch prompt copied!');
                });
            });
        }
    }

    exportBatchResults() {
        if (!this.batchResults || this.batchResults.length === 0) {
            this.showToast('No batch results to export.', 'error');
            return;
        }

        const csv = this.batchResults.map((result, index) => {
            return `${index + 1},"${result.preset}","${result.music.replace(/"/g, '""')}","${(result.lyrics || '').replace(/"/g, '""')}"`;
        }).join('\n');

        const header = 'Index,Preset,Styles Prompt,Lyrics Prompt\n';
        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `batch-prompts-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Batch results exported!', 'success');
    }

    // ==================== PROMPT VERSIONING ====================
    
    initPromptVersioning() {
        // Versioning is integrated into savePrompt
    }

    savePromptWithVersion() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        const currentData = this.collectFormData();
        
        if (!musicPrompt && !lyricsPrompt) {
            this.showToast('No prompt to save. Please generate a prompt first.', 'error');
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

        const history = this.getHistory();
        // Try to find similar prompt (same form data)
        const existingVersion = history.find(item => {
            const itemData = item.data || {};
            if (!itemData || Object.keys(itemData).length === 0) return false;
            // Check if key fields match
            const keyFields = ['genre', 'tempo', 'mood'];
            return keyFields.every(field => {
                const itemVal = itemData[field] || '';
                const currentVal = currentData[field] || '';
                return itemVal === currentVal && itemVal !== '';
            });
        });

        let version = 1;
        if (existingVersion) {
            version = (existingVersion.version || 1) + 1;
            existingVersion.version = version;
            existingVersion.date = new Date().toLocaleDateString();
            existingVersion.time = new Date().toLocaleTimeString();
            existingVersion.prompt = combined;
            existingVersion.data = currentData;
        } else {
            const newItem = {
                id: Date.now(),
                prompt: combined,
                data: currentData,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
                version: 1,
                favorite: false
            };
            history.unshift(newItem);
        }

        this.saveHistory(history);
        this.loadHistory();
        this.showToast(`Prompt saved${existingVersion ? ` (v${version})` : ''}!`, 'success');
        this.trackSaveAction();
    }

    // ==================== ADVANCED EXPORT/IMPORT ====================
    
    exportAsCSV() {
        const history = this.getHistory();
        if (history.length === 0) {
            this.showToast('No history to export.', 'error');
            return;
        }

        const csv = history.map(item => {
            const prompt = item.prompt.replace(/"/g, '""');
            const date = item.date || '';
            const time = item.time || '';
            return `"${date}","${time}","${prompt}"`;
        }).join('\n');

        const header = 'Date,Time,Prompt\n';
        const blob = new Blob([header + csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `suno-prompts-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('History exported as CSV!', 'success');
    }

    exportForSuno() {
        const musicPrompt = this.promptMusic.value;
        const lyricsPrompt = this.promptLyrics.value;
        
        if (!musicPrompt && !lyricsPrompt) {
            this.showToast('No prompt to export.', 'error');
            return;
        }

        // Format optimized for Suno AI
        let sunoFormat = '';
        if (musicPrompt) {
            sunoFormat += `[STYLES]\n${musicPrompt}\n\n`;
        }
        if (lyricsPrompt) {
            sunoFormat += `[LYRICS]\n${lyricsPrompt}`;
        }

        const blob = new Blob([sunoFormat], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `suno-prompt-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Exported in Suno format!', 'success');
    }

    // Helper function to apply preset data
    applyPresetData(data) {
        Object.keys(data).forEach(key => {
            const el = document.getElementById(key);
            if (el && data[key]) {
                if (el.tagName === 'SELECT') {
                    el.value = data[key];
                } else {
                    el.value = data[key];
                }
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        this.updateProgressIndicator();
        this.updateAdvancedPreview();
    }

    // Helper function to collect form data
    collectFormData() {
        const data = {};
        this.progressConfig.forEach(field => {
            const el = document.getElementById(field.id);
            if (el && el.value) {
                data[field.id] = el.value;
            }
        });
        return data;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SunoPromptBuilder();
});

