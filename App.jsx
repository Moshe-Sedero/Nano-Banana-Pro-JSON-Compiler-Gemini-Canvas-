import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, Unlock, RefreshCw, Copy, Check, ChevronDown, ChevronRight, RotateCcw, Zap, Download, X, Layers, Info, XCircle, AlertTriangle, Plus, Trash2, Grid, Undo2, ChevronsDown, ChevronsUp, ArrowRight } from 'lucide-react';

// ==========================================
// SECTION 1: CONFIGURATION & DATA CONSTANTS
// ==========================================

const SCHEMA = {
  meta: {
    title: 'Meta',
    fields: {
      version: { type: 'const', value: '1.0.0', label: 'Version' }, 
      identity_preservation: { 
        type: 'select', 
        options: ['strict', 'balanced', 'off'], 
        default: 'strict', 
        label: 'Identity Preservation' 
      },
      project_name: { type: 'text', default: '', label: 'Project Name (Optional)' },
    }
  },
  reference_image: {
    title: 'Reference Image',
    fields: {
      enabled: { type: 'boolean', default: false, label: 'Enable Reference' },
      require_attachment_later: { type: 'boolean', default: true, label: 'Require Attachment' },
      fidelity: { 
        type: 'select', 
        options: ['strict', 'balanced', 'loose'], 
        default: 'strict', 
        label: 'Fidelity' 
      },
      // Advanced section (Collapsible in UI)
      preserve_full_face: { type: 'boolean', default: true, label: 'Preserve Full Face' },
      preserve_face_identity: { type: 'boolean', default: true, label: 'Face Identity' },
      preserve_facial_structure: { type: 'boolean', default: true, label: 'Facial Structure' },
      preserve_bone_structure: { type: 'boolean', default: true, label: 'Bone Structure' },
      preserve_proportions: { type: 'boolean', default: true, label: 'Proportions' },
      preserve_eyes_shape: { type: 'boolean', default: true, label: 'Eyes Shape' },
      preserve_eye_color: { type: 'boolean', default: true, label: 'Eye Color' },
      preserve_eyebrows_shape: { type: 'boolean', default: true, label: 'Eyebrows Shape' },
      preserve_nose_shape: { type: 'boolean', default: true, label: 'Nose Shape' },
      preserve_mouth_lips_shape: { type: 'boolean', default: true, label: 'Mouth/Lips Shape' },
      preserve_jawline_chin: { type: 'boolean', default: true, label: 'Jawline/Chin' },
      preserve_cheekbones: { type: 'boolean', default: true, label: 'Cheekbones' },
      preserve_ears_shape: { type: 'boolean', default: true, label: 'Ears Shape' },
      preserve_skin_tone: { type: 'boolean', default: true, label: 'Skin Tone' },
      preserve_skin_texture: { type: 'boolean', default: true, label: 'Skin Texture' },
    }
  },
  subject: {
    title: 'Subject',
    fields: {
      type: { 
        type: 'select', 
        options: ['person', 'character', 'object'], 
        default: 'person', 
        label: 'Type'
      },
      gender: { 
        type: 'select', 
        options: ['male', 'female', 'unspecified'], 
        default: 'unspecified', 
        label: 'Gender'
      },
      age_range: { 
        type: 'select', 
        options: ['20s', '30s', '40s', 'unspecified'], 
        default: 'unspecified', 
        label: 'Age Range'
      },
      archetype: {
        type: 'select',
        options: ['neutral','glamour','girl_next_door','sporty','elegant','editorial','comics_characters'],
        default: 'neutral',
        label: 'Archetype'
      },
      comics_character: {
        type: 'select',
        options: [
          'batman', 'superman', 'wonder_woman', 'the_flash', 'aquaman', 'harley_quinn', 'joker', 'lex_luthor', 'catwoman', 'darkseid',
          'spider_man', 'iron_man', 'captain_america', 'black_widow', 'captain_marvel', 'scarlet_witch', 'doctor_strange', 'loki', 'thanos', 'hela'
        ],
        default: 'batman',
        label: 'Comics Character'
      },
      beauty_vibe: {
        type: 'select',
        options: ['neutral','confident','playful','flirty','alluring','seductive','elegant'],
        default: 'neutral',
        label: 'Beauty Vibe'
      },
      mood: {
        type: 'select',
        options: ['neutral','beautiful_flirty','effortlessly_attractive','effortlessly_sexy'],
        default: 'neutral',
        label: 'Mood'
      },
      makeup_style: {
        type: 'select',
        options: ['none','natural','soft_glam','glam'],
        default: 'none',
        label: 'Makeup Style'
      },
      body_type: { 
        type: 'select', 
        options: ['unspecified','slim','athletic','fit','curvy','slim_curvy','fit_curvaceous','voluptuous_hourglass','muscular'], 
        default: 'unspecified', 
        label: 'Body Type'
      },
      hair_style: { 
        type: 'select', 
        options: ['unspecified','loose_waves','straight_sleek','curly','messy_bun','high_ponytail','braided','short_crop'], 
        default: 'unspecified', 
        label: 'Hair Style'
      },
      hair_color: {
        type: 'select',
        options: ['unspecified', 'blonde', 'brunette', 'black', 'red', 'auburn', 'gray', 'white', 'platinum_blonde', 'pastel_pink', 'blue', 'green'],
        default: 'unspecified',
        label: 'Hair Color'
      },
      skin_texture: {
        type: 'select',
        options: ['natural', 'detailed', 'ultra_detailed'],
        default: 'natural',
        label: 'Skin Texture'
      },
      attractiveness_notes: { type: 'text', maxLength: 120, default: '', label: 'Attractiveness Notes' },
      demographics_notes: { type: 'text', maxLength: 120, default: '', label: 'Demographics Notes' },
    }
  },
  pose: {
    title: 'Pose',
    fields: {
      type: { 
        type: 'select', 
        options: ['standing', 'walking', 'seated', 'leaning', 'crouching', 'running', 'kneeling', 'over_shoulder', 'mirror_selfie'], 
        default: 'standing', 
        label: 'Pose Type'
      },
      expression: {
        type: 'select',
        options: ['neutral', 'subtle_smile', 'confident', 'serious', 'playful'],
        default: 'neutral',
        label: 'Expression'
      },
      detail: {
        type: 'select',
        options: ['none','hand_on_hip','arms_crossed','hair_touch','looking_over_shoulder','walking_stride','seated_legs_crossed','mirror_phone_hold','leaning_wall'],
        default: 'none', 
        label: 'Pose Detail'
      },
      detail_notes: { type: 'text', maxLength: 80, default: '', label: 'Pose Detail Notes (Optional)' },
    }
  },
  apparel: {
    title: 'Apparel',
    fields: {
      upper: { type: 'select', options: ['none', 'casual', 'streetwear', 'formal', 'athletic', 'swimwear', 'workwear', 'costume'], default: 'casual', label: 'Upper Body' },
      lower: { type: 'select', options: ['none', 'casual', 'streetwear', 'formal', 'athletic', 'swimwear', 'workwear', 'costume'], default: 'casual', label: 'Lower Body' },
      fit: { type: 'select', options: ['loose', 'relaxed', 'fitted', 'tight'], default: 'fitted', label: 'Fit' }
    }
  },
  accessories: {
    title: 'Accessories',
    fields: {
      props: { type: 'select', options: ['none', 'smartphone', 'headphones', 'bag', 'coffee', 'bottle', 'ice_cream'], default: 'none', label: 'Props' },
      jewelry: { type: 'select', options: ['none','hoops','studs','necklace','chain','bracelet','rings','watch'], default: 'none', label: 'Jewelry' },
      jewelry_custom: { type: 'text', maxLength: 80, default: '', label: 'Custom Jewelry (Optional)' }
    }
  },
  scene: {
    title: 'Scene',
    fields: {
      location: { 
        type: 'select', 
        options: ['indoor_room', 'gym', 'beach', 'forest', 'desert', 'mountains', 'cafe', 'library', 'park', 'subway', 'convenience_store', 'city_square', 'urban_street', 'studio'], 
        default: 'indoor_room', 
        label: 'Location' 
      },
      time_of_day: { type: 'select', options: ['day', 'night', 'blue_hour'], default: 'day', label: 'Time of Day' },
      weather: { type: 'select', options: ['clear', 'rainy', 'foggy'], default: 'clear', label: 'Weather' },
      elements: { type: 'select', options: ['none','mirror','neon_sign','street_lights','gym_mirrors','dumbbells','palm_trees','traffic_lights','rain_puddles','billboards','smoke_haze'], default: 'none', label: 'Scene Elements' },
      elements_custom: { type: 'text', maxLength: 120, default: '', label: 'Custom Elements (Optional)' }
    }
  },
  camera: {
    title: 'Camera',
    fields: {
      device: { type: 'select', options: ['smartphone', 'mirrorless', 'dslr', 'film_35mm'], default: 'smartphone', label: 'Device' },
      shot_type: { 
        type: 'select', 
        options: ['extreme_close_up', 'close_up', 'medium_shot', 'cowboy_shot', 'knee_shot', 'full_body', 'wide'], 
        default: 'medium_shot', 
        label: 'Shot Type' 
      },
      angle: { 
        type: 'select', 
        options: ['eye_level', 'low_angle', 'high_angle', 'dutch_angle', 'bird_eye_view', 'worm_eye_view'], 
        default: 'eye_level', 
        label: 'Angle' 
      },
      lens: { type: 'select', options: ['24mm', '35mm', '50mm', '85mm'], default: '50mm', label: 'Lens' },
      depth_of_field: { type: 'select', options: ['shallow', 'medium', 'deep'], default: 'shallow', label: 'Depth of Field' },
    }
  },
  lighting: {
    title: 'Lighting',
    fields: {
      primary: { type: 'select', options: ['natural', 'studio', 'overhead', 'neon', 'phone_flash'], default: 'natural', label: 'Primary Source' },
      quality: { type: 'select', options: ['soft', 'dramatic', 'high_contrast'], default: 'soft', label: 'Quality' },
      direction: { type: 'select', options: ['front', 'side', 'back', 'overhead'], default: 'side', label: 'Direction' },
    }
  },
  style: {
    title: 'Style',
    fields: {
      look: { type: 'select', options: ['photorealistic', 'cinematic', 'illustration', 'street_view'], default: 'photorealistic', label: 'Look' },
      rawness: { type: 'select', options: ['clean', 'natural', 'gritty'], default: 'natural', label: 'Rawness' },
    }
  },
  output: {
    title: 'Output',
    fields: {
      aspect_ratio: { type: 'select', options: ['1:1', '2:3', '3:4', '4:5', '9:16', '16:9', '2.39:1'], default: '3:4', label: 'Aspect Ratio' },
      quality: { type: 'select', options: ['standard', 'high'], default: 'high', label: 'Quality' },
      resolution: { type: 'select', options: ['HD', '2K', '4K'], default: 'HD', label: 'Resolution' },
    }
  },
  negative: {
    title: 'Negative',
    fields: {
      no_plastic_skin: { type: 'boolean', default: true, label: 'No Plastic Skin' },
      no_extra_limbs: { type: 'boolean', default: true, label: 'No Extra Limbs' },
      no_watermark: { type: 'boolean', default: true, label: 'No Watermark' },
      no_over_smoothing: { type: 'boolean', default: true, label: 'No Over-smoothing' },
      no_text: { type: 'boolean', default: false, label: 'No Text' },
    }
  }
};

const CONSTRAINTS = {
  poseDetailAllowedByPoseType: {
    mirror_selfie: ['none', 'mirror_phone_hold'],
    seated: ['none', 'seated_legs_crossed'],
    walking: ['none', 'walking_stride'],
    leaning: ['none', 'leaning_wall', 'hand_on_hip', 'arms_crossed'],
    running: ['none'],
    crouching: ['none'],
    kneeling: ['none'],
    over_shoulder: ['none', 'looking_over_shoulder', 'hair_touch'],
    standing: ['none', 'hand_on_hip', 'arms_crossed', 'hair_touch', 'looking_over_shoulder']
  },
  sceneApparelRules: {
    beach: { allowed: ['swimwear', 'casual', 'none', 'costume'], msg: 'Beach requires Swimwear/Casual' },
    gym: { allowed: ['athletic', 'casual', 'none'], msg: 'Gym requires Athletic/Casual' }
  },
  poseApparelRules: {
    running: { allowed: ['athletic', 'casual', 'streetwear', 'none'], msg: 'Running requires Athletic/Casual' }
  },
  poseForbiddenProps: {
    running: ['coffee', 'bag', 'ice_cream', 'smartphone'],
    crouching: [],
    kneeling: []
  },
  cameraLensRules: [
    { condition: ['extreme_close_up', 'close_up'], allowed: ['50mm', '85mm'] },
    { condition: ['full_body', 'wide'], allowed: ['24mm', '35mm', '50mm'] }
  ],
  multiSelectNoneExclusive: [
    'accessories.jewelry',
    'scene.elements'
  ],
  comicsGenders: {
    male: ['batman', 'superman', 'the_flash', 'aquaman', 'joker', 'lex_luthor', 'darkseid', 'spider_man', 'iron_man', 'captain_america', 'doctor_strange', 'loki', 'thanos'],
    female: ['wonder_woman', 'harley_quinn', 'catwoman', 'black_widow', 'captain_marvel', 'scarlet_witch', 'hela']
  }
};

const REFERENCE_INSTRUCTIONS = [
  "Use the attached reference image as the identity anchor.",
  "Preserve the same person. Do not change identity.",
  "Preserve all facial features: structure, proportions, eyes, brows, nose, lips, jawline, ears, skin tone, skin texture, and unique marks.",
  "Avoid beautification, face reshaping, or feature swapping."
];

const PRESETS = [
  {
    name: "Glamour Portrait (Attractive Female)",
    values: {
      'subject.gender': 'female',
      'subject.age_range': '30s',
      'subject.archetype': 'glamour',
      'subject.beauty_vibe': 'confident',
      'subject.mood': 'effortlessly_attractive',
      'subject.makeup_style': 'soft_glam',
      'subject.body_type': 'slim_curvy',
      'camera.shot_type': 'medium_shot',
      'camera.lens': '85mm',
      'camera.depth_of_field': 'shallow',
      'lighting.quality': 'soft',
      'lighting.direction': 'front',
      'negative.no_plastic_skin': true,
      'negative.no_over_smoothing': true
    }
  },
  {
    name: "Phone Flash Mirror Selfie",
    values: {
      'scene.location': 'indoor_room',
      'lighting.primary': 'phone_flash',
      'pose.type': 'mirror_selfie',
      'accessories.props': 'smartphone',
      'style.look': 'photorealistic'
    }
  },
  {
    name: "Luxury Gym Overhead Lights",
    values: {
      'scene.location': 'gym',
      'lighting.primary': 'overhead',
      'lighting.quality': 'high_contrast',
      'style.look': 'photorealistic'
    }
  },
  {
    name: "Tropical Beach Midday",
    values: {
      'scene.location': 'beach',
      'scene.time_of_day': 'day',
      'lighting.primary': 'natural',
      'style.look': 'cinematic'
    }
  },
  {
    name: "Convenience Store Night",
    values: {
      'scene.location': 'convenience_store',
      'scene.time_of_day': 'night',
      'lighting.primary': 'neon',
      'style.look': 'photorealistic'
    }
  },
  {
    name: "City Square Blue Hour",
    values: {
      'scene.location': 'city_square',
      'scene.time_of_day': 'blue_hour',
      'lighting.primary': 'natural',
      'style.look': 'cinematic'
    }
  },
  {
    name: "Street View Screenshot Look",
    values: {
      'style.look': 'street_view',
      'style.rawness': 'clean',
      'negative.no_text': true,
      'camera.shot_type': 'wide'
    }
  }
];

const ALIAS_MAP = {
  'meta.aspect_ratio': 'output.aspect_ratio',
  'parameters.aspect_ratio': 'output.aspect_ratio',
  'parameters.resolution': 'output.resolution',
  'constraints.fidelity': 'reference_image.fidelity',
  'facial_fidelity': 'reference_image.fidelity',
  'environment.setting': 'scene.location',
  'environment.location': 'scene.location',
  'scene.environment': 'scene.location',
  'scene.setting': 'scene.location',
  'pose_action.type': 'pose.type',
  'subject.demographics': 'subject.demographics_notes',
  'subject.physique': 'subject.body_type',
  'body_proportions': 'subject.body_type',
  'subject.physiology': 'subject.skin_texture',
  'apparel.upper_body': 'apparel.upper',
  'apparel.lower_body': 'apparel.lower',
  'garment_type_upper': 'apparel.upper',
  'garment_type_lower': 'apparel.lower',
  'subject.accessories': 'accessories.props',
  'accessories.tech': 'accessories.props',
  'style.aesthetic': 'style.look',
  'style.realism': 'style.rawness'
};

const NEGATIVE_ALIAS_KEYS = ['forbidden_elements', 'negative_constraints', 'negative.forbidden'];

// ==========================================
// SECTION 2: UTILITIES
// ==========================================

const getRandomOption = (options, exclude = []) => {
  const filtered = options.filter(opt => !exclude.includes(opt));
  return filtered[Math.floor(Math.random() * filtered.length)];
};

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getInitialState = () => {
  const state = {};
  Object.keys(SCHEMA).forEach(group => {
    state[group] = {};
    Object.keys(SCHEMA[group].fields).forEach(field => {
      if (SCHEMA[group].fields[field].type === 'const') {
        state[group][field] = SCHEMA[group].fields[field].value;
      } else if (SCHEMA[group].fields[field].type === 'multi_select') {
        state[group][field] = SCHEMA[group].fields[field].default; 
      } else {
        state[group][field] = SCHEMA[group].fields[field].default;
      }
    });
  });
  return state;
};

const getInitialLocks = () => {
  const locks = {};
  Object.keys(SCHEMA).forEach(group => {
    locks[group] = {};
    Object.keys(SCHEMA[group].fields).forEach(field => {
      locks[group][field] = false;
    });
  });
  return locks;
};

const updateStateAtPath = (state, path, value) => {
  const parts = path.split('.');
  if (parts.length !== 2) return state; 
  const [group, field] = parts;
  
  if (state[group] && state[group].hasOwnProperty(field)) {
    const schemaField = SCHEMA[group].fields[field];
    if (!schemaField) return;

    if (schemaField.type === 'select') {
       if (schemaField.options.includes(value)) {
         state[group][field] = value;
       }
    } else if (schemaField.type === 'array_text') {
       if (Array.isArray(value)) {
           state[group][field] = value.join(', ');
       } else if (typeof value === 'string') {
           state[group][field] = value;
       }
    } else if (schemaField.type === 'multi_select') {
       let imports = [];
       if (Array.isArray(value)) imports = value;
       else if (typeof value === 'string') imports = value.split(',').map(s => s.trim());
       
       const allowed = [];
       const custom = [];
       
       imports.forEach(item => {
         const match = schemaField.options.find(opt => opt.toLowerCase() === item.toLowerCase());
         if (match) allowed.push(match);
         else custom.push(item);
       });
       
       state[group][field] = allowed;
       if (custom.length > 0 && SCHEMA[group].fields[field + '_custom']) {
          state[group][field + '_custom'] = custom.join(', ');
       }

    } else if (schemaField.type === 'boolean') {
       state[group][field] = !!value;
    } else if (schemaField.type === 'text') {
       if (typeof value === 'string' || typeof value === 'number') {
           state[group][field] = String(value);
       }
    } else {
       state[group][field] = value;
    }
  }
};

// ==========================================
// SECTION 3: CUSTOM HOOK (The "Brain")
// ==========================================

const usePromptEngine = () => {
  const [data, setData] = useState(getInitialState());
  const [locks, setLocks] = useState(getInitialLocks());
  const locksRef = useRef(locks);

  // Multi-JSON and Undo State
  const [jsonBatch, setJsonBatch] = useState([]);
  const [isMultiPanel, setIsMultiPanel] = useState(false);
  const [globalAspectRatio, setGlobalAspectRatio] = useState('16:9');
  const [history, setHistory] = useState([]);
  const [refDetailsOpen, setRefDetailsOpen] = useState(false);

  useEffect(() => {
    locksRef.current = locks;
  }, [locks]);

  const [collapsed, setCollapsed] = useState({ meta: false, output: true, negative: true });
  const [toast, setToast] = useState(null);
  const [conflicts, setConflicts] = useState({});
  const [conflictModalOpen, setConflictModalOpen] = useState(false);

  // Authoritative Allowed Options Logic
  const getAllowedOptions = useCallback((group, field, currentData) => {
    const schemaField = SCHEMA[group].fields[field];
    if (!schemaField || !schemaField.options) return [];
    
    let validOptions = [...schemaField.options];

    // Pose Detail Validity
    if (group === 'pose' && field === 'detail') {
      const allowed = CONSTRAINTS.poseDetailAllowedByPoseType[currentData.pose.type] || ['none'];
      validOptions = validOptions.filter(opt => allowed.includes(opt));
    }

    // Apparel Compatibility
    if (group === 'apparel' && (field === 'upper' || field === 'lower')) {
      const sceneRule = CONSTRAINTS.sceneApparelRules[currentData.scene.location];
      if (sceneRule) {
        validOptions = validOptions.filter(opt => sceneRule.allowed.includes(opt));
      }
      const poseRule = CONSTRAINTS.poseApparelRules[currentData.pose.type];
      if (poseRule) {
        validOptions = validOptions.filter(opt => poseRule.allowed.includes(opt));
      }
    }

    // Props Compatibility
    if (group === 'accessories' && field === 'props') {
      const forbidden = CONSTRAINTS.poseForbiddenProps[currentData.pose.type];
      if (forbidden) {
        validOptions = validOptions.filter(opt => !forbidden.includes(opt));
      }
    }

    // Comics Character Gender Filter
    if (group === 'subject' && field === 'comics_character') {
        const gender = currentData.subject.gender;
        if (gender === 'male') {
            validOptions = validOptions.filter(opt => CONSTRAINTS.comicsGenders.male.includes(opt));
        } else if (gender === 'female') {
            validOptions = validOptions.filter(opt => CONSTRAINTS.comicsGenders.female.includes(opt));
        }
    }

    return validOptions;
  }, []);

  // validateAndFix
  const validateAndFix = useCallback((draftData, currentLocks) => {
    const isUnlocked = (g, f) => !currentLocks[g][f];
    const newConflicts = {};
    const registerConflict = (group, field, from, to, reason, ruleId, isUnresolved = false) => {
        if (from !== to || isUnresolved) {
            newConflicts[`${group}.${field}`] = { from, to, reason, ruleId, isUnresolved };
        }
    };

    // --- A. Pose Detail Integrity ---
    const allowedDetails = CONSTRAINTS.poseDetailAllowedByPoseType[draftData.pose.type] || ['none'];
    if (!allowedDetails.includes(draftData.pose.detail)) {
      if (isUnlocked('pose', 'detail')) {
        const old = draftData.pose.detail;
        draftData.pose.detail = 'none';
        registerConflict('pose', 'detail', old, 'none', `Incompatible with ${draftData.pose.type}`, 'pose-detail');
      } else {
        registerConflict('pose', 'detail', draftData.pose.detail, 'none', `Incompatible with ${draftData.pose.type} (Locked)`, 'pose-detail', true);
      }
    }

    // --- B. Mirror Selfie / Smartphone Enforcement ---
    if (draftData.pose.type === 'mirror_selfie') {
      if (draftData.accessories.props !== 'smartphone') {
        if (isUnlocked('accessories', 'props')) {
          const old = draftData.accessories.props;
          draftData.accessories.props = 'smartphone';
          registerConflict('accessories', 'props', old, 'smartphone', 'Mirror Selfie requires Smartphone', 'mirror-props');
        } else if (isUnlocked('pose', 'type')) {
          const old = draftData.pose.type;
          draftData.pose.type = 'standing';
          registerConflict('pose', 'type', old, 'standing', 'Mirror Selfie requires Smartphone (Locked)', 'mirror-props-reverse');
          if (draftData.pose.detail === 'mirror_phone_hold' && isUnlocked('pose', 'detail')) {
             draftData.pose.detail = 'none';
          }
        } else {
          registerConflict('accessories', 'props', draftData.accessories.props, 'smartphone', 'Mirror Selfie requires Smartphone (Locked)', 'mirror-props', true);
        }
      }
    }
    
    if (draftData.pose.detail === 'mirror_phone_hold') {
       if (draftData.pose.type !== 'mirror_selfie') {
         if (isUnlocked('pose', 'type')) {
            const old = draftData.pose.type;
            draftData.pose.type = 'mirror_selfie';
            registerConflict('pose', 'type', old, 'mirror_selfie', 'Mirror Hold implies Mirror Selfie', 'mirror-type');
         } else if (isUnlocked('pose', 'detail')) {
            draftData.pose.detail = 'none';
            registerConflict('pose', 'detail', 'mirror_phone_hold', 'none', 'Mirror Hold requires Mirror Selfie (Locked)', 'mirror-type-rev');
         } else {
            registerConflict('pose', 'type', draftData.pose.type, 'mirror_selfie', 'Mirror Hold implies Mirror Selfie (Locked)', 'mirror-type', true);
         }
       }
       if (draftData.pose.detail === 'mirror_phone_hold' && draftData.accessories.props !== 'smartphone') {
         if (isUnlocked('accessories', 'props')) {
            const old = draftData.accessories.props;
            draftData.accessories.props = 'smartphone';
            registerConflict('accessories', 'props', old, 'smartphone', 'Mirror Hold requires Smartphone', 'mirror-props');
         } else if (isUnlocked('pose', 'detail')) {
            draftData.pose.detail = 'none';
            registerConflict('pose', 'detail', 'mirror_phone_hold', 'none', 'Mirror Hold requires Smartphone (Locked)', 'mirror-props-rev');
         } else {
            registerConflict('accessories', 'props', draftData.accessories.props, 'smartphone', 'Mirror Hold requires Smartphone (Locked)', 'mirror-props', true);
         }
       }
    }

    // --- C. Lighting & Time ---
    if (draftData.lighting.primary === 'phone_flash') {
      if (!['night', 'blue_hour'].includes(draftData.scene.time_of_day)) {
        if (isUnlocked('scene', 'time_of_day')) {
            const old = draftData.scene.time_of_day;
            draftData.scene.time_of_day = 'night';
            registerConflict('scene', 'time_of_day', old, 'night', 'Phone Flash requires Night/Blue Hour', 'phone-flash-time');
        } else {
            registerConflict('scene', 'time_of_day', draftData.scene.time_of_day, 'night', 'Phone Flash requires Night/Blue Hour (Locked)', 'phone-flash-time', true);
        }
      }
    }

    // --- D. Street View Constraints ---
    if (draftData.style.look === 'street_view') {
      if (draftData.style.rawness !== 'clean') {
        if (isUnlocked('style', 'rawness')) {
            const old = draftData.style.rawness;
            draftData.style.rawness = 'clean';
            registerConflict('style', 'rawness', old, 'clean', 'Street View requires Clean style', 'street-view-style');
        } else {
            registerConflict('style', 'rawness', draftData.style.rawness, 'clean', 'Street View requires Clean style (Locked)', 'street-view-style', true);
        }
      }
      if (!draftData.negative.no_text) {
        if (isUnlocked('negative', 'no_text')) {
            draftData.negative.no_text = true;
            registerConflict('negative', 'no_text', false, true, 'Street View requires No Text', 'street-view-neg');
        } else {
            registerConflict('negative', 'no_text', false, true, 'Street View requires No Text (Locked)', 'street-view-neg', true);
        }
      }
    }

    // --- E. Archetype / Comics Character ---
    if (draftData.subject.archetype !== 'comics_characters') {
      if (draftData.subject.comics_character !== 'batman') {
         if (isUnlocked('subject', 'comics_character')) {
             const old = draftData.subject.comics_character;
             draftData.subject.comics_character = 'batman'; 
             registerConflict('subject', 'comics_character', old, 'batman', 'Archetype changed', 'comics-reset');
         }
      }
    } else {
        // Gender Check for Comics Character
        const char = draftData.subject.comics_character;
        const gender = draftData.subject.gender;
        const isMaleChar = CONSTRAINTS.comicsGenders.male.includes(char);
        const isFemaleChar = CONSTRAINTS.comicsGenders.female.includes(char);
        
        if ((gender === 'male' && isFemaleChar) || (gender === 'female' && isMaleChar)) {
            if (isUnlocked('subject', 'comics_character')) {
                const old = draftData.subject.comics_character;
                const fallback = gender === 'male' ? 'batman' : 'wonder_woman';
                draftData.subject.comics_character = fallback;
                registerConflict('subject', 'comics_character', old, fallback, `Character gender mismatch with ${gender}`, 'comics-gender');
            } else if (isUnlocked('subject', 'gender')) {
                const old = draftData.subject.gender;
                const next = isMaleChar ? 'male' : 'female';
                draftData.subject.gender = next;
                registerConflict('subject', 'gender', old, next, `Gender mismatch with ${char}`, 'comics-gender-rev');
            } else {
                registerConflict('subject', 'comics_character', draftData.subject.comics_character, 'valid', `Gender mismatch with ${gender} (Locked)`, 'comics-gender', true);
            }
        }
    }

    // --- F. Apparel Compatibility ---
    ['upper', 'lower'].forEach(part => {
        const sceneRule = CONSTRAINTS.sceneApparelRules[draftData.scene.location];
        if (sceneRule && !sceneRule.allowed.includes(draftData.apparel[part])) {
            if (isUnlocked('apparel', part)) {
                const old = draftData.apparel[part];
                const fallback = sceneRule.allowed.find(opt => opt !== 'none') || 'none';
                draftData.apparel[part] = fallback;
                registerConflict('apparel', part, old, fallback, sceneRule.msg, 'scene-apparel');
            } else {
                registerConflict('apparel', part, draftData.apparel[part], 'valid', `${sceneRule.msg} (Locked)`, 'scene-apparel', true);
            }
        }
        const poseRule = CONSTRAINTS.poseApparelRules[draftData.pose.type];
        if (poseRule && !poseRule.allowed.includes(draftData.apparel[part])) {
            if (isUnlocked('apparel', part)) {
                const old = draftData.apparel[part];
                const fallback = poseRule.allowed.find(opt => opt !== 'none') || 'none';
                draftData.apparel[part] = fallback;
                registerConflict('apparel', part, old, fallback, poseRule.msg, 'pose-apparel');
            } else {
                registerConflict('apparel', part, draftData.apparel[part], 'valid', `${poseRule.msg} (Locked)`, 'pose-apparel', true);
            }
        }
    });

    // --- G. Prop Compatibility ---
    const forbiddenProps = CONSTRAINTS.poseForbiddenProps[draftData.pose.type];
    if (forbiddenProps && forbiddenProps.includes(draftData.accessories.props)) {
        if (isUnlocked('accessories', 'props')) {
            const old = draftData.accessories.props;
            draftData.accessories.props = 'none';
            registerConflict('accessories', 'props', old, 'none', `Cannot hold ${old} while ${draftData.pose.type}`, 'prop-pose');
        } else {
            registerConflict('accessories', 'props', draftData.accessories.props, 'none', `Cannot hold ${draftData.accessories.props} while ${draftData.pose.type} (Locked)`, 'prop-pose', true);
        }
    }

    // --- H. Multi-select Exclusivity ---
    CONSTRAINTS.multiSelectNoneExclusive.forEach(path => {
        const [g, f] = path.split('.');
        const val = draftData[g][f];
        if (Array.isArray(val)) {
            if (val.length > 1 && val.includes('none')) {
                if (isUnlocked(g, f)) {
                    draftData[g][f] = val.filter(x => x !== 'none');
                    registerConflict(g, f, 'mixed', 'filtered', '"None" is exclusive', 'multi-select-none');
                }
            }
        }
    });

    // --- I. Camera Lens ---
    const lensRule = CONSTRAINTS.cameraLensRules.find(rule => {
        const cond = rule.condition;
        return Array.isArray(cond) 
          ? cond.includes(draftData.camera.shot_type)
          : cond === draftData.camera.shot_type;
    });
    if (lensRule && !lensRule.allowed.includes(draftData.camera.lens)) {
        if (isUnlocked('camera', 'lens')) {
            const old = draftData.camera.lens;
            draftData.camera.lens = lensRule.allowed[0];
            registerConflict('camera', 'lens', old, lensRule.allowed[0], `Lens invalid for ${draftData.camera.shot_type}`, 'lens-validity');
        } else {
            registerConflict('camera', 'lens', draftData.camera.lens, lensRule.allowed[0], `Lens invalid for ${draftData.camera.shot_type} (Locked)`, 'lens-validity', true);
        }
    }

    return { data: draftData, conflicts: newConflicts };
  }, []);

  // applySoftSteering
  const applySoftSteering = useCallback((draftData, currentLocks, isRandomization) => {
    const isUnlocked = (g, f) => !currentLocks[g][f];

    const isAdultFemale = draftData.subject.gender === 'female' && draftData.subject.age_range !== 'unspecified';
    if (isAdultFemale) {
        if (isUnlocked('pose', 'expression')) {
            const vibe = draftData.subject.beauty_vibe;
            const map = { playful: 'playful', flirty: 'subtle_smile', confident: 'confident', alluring: 'serious', seductive: 'serious', elegant: 'neutral' };
            if (map[vibe]) draftData.pose.expression = map[vibe];
        }
        const mood = draftData.subject.mood;
        if (['beautiful_flirty', 'effortlessly_attractive'].includes(mood)) {
            if (isUnlocked('lighting', 'quality')) draftData.lighting.quality = 'soft';
            if (isUnlocked('lighting', 'direction')) draftData.lighting.direction = 'front';
            if (isUnlocked('camera', 'depth_of_field')) draftData.camera.depth_of_field = 'shallow';
        } else if (mood === 'effortlessly_sexy') {
             if (isUnlocked('lighting', 'quality')) draftData.lighting.quality = 'dramatic';
             if (isUnlocked('camera', 'depth_of_field')) draftData.camera.depth_of_field = 'shallow';
        }
        if (isUnlocked('negative', 'no_plastic_skin')) draftData.negative.no_plastic_skin = true;
        if (isUnlocked('negative', 'no_over_smoothing')) draftData.negative.no_over_smoothing = true;
    }

    if (isRandomization && ['glamour', 'editorial', 'elegant'].includes(draftData.subject.archetype)) {
        if (isUnlocked('camera', 'shot_type')) draftData.camera.shot_type = 'medium_shot';
        if (isUnlocked('camera', 'lens')) draftData.camera.lens = getRandomOption(['50mm', '85mm']);
    }

    return draftData;
  }, []);

  const commitData = useCallback((nextData, isRandomization = false) => {
    setHistory(prev => {
        const newState = [...prev, { 
            data: JSON.parse(JSON.stringify(data)), 
            locks: JSON.parse(JSON.stringify(locksRef.current)),
            conflicts: JSON.parse(JSON.stringify(conflicts)) 
        }];
        return newState.slice(-20);
    });

    const currentLocks = locksRef.current;
    let processed = applySoftSteering(nextData, currentLocks, isRandomization);
    const { data: finalData, conflicts: newConflicts } = validateAndFix(processed, currentLocks);
    
    setData(finalData);
    setConflicts(newConflicts); 
    if (isRandomization && Object.keys(newConflicts).length > 0) {
      setConflictModalOpen(true);
    }
  }, [applySoftSteering, validateAndFix, data, conflicts]);

  // Handlers
  const handleUndo = () => {
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setData(prev.data);
      setLocks(prev.locks);
      locksRef.current = prev.locks;
      setConflicts(prev.conflicts);
      showToast('Undo successful', 'info');
  };

  const handleValueChange = (group, field, value) => commitData({ ...data, [group]: { ...data[group], [field]: value } });
  const handleMultiSelectToggle = (group, field, option) => {
    if (locks[group][field]) return;
    const current = data[group][field] || [];
    let next = option === 'none' ? (current.includes('none') ? [] : ['none']) : (current.includes(option) ? current.filter(i => i !== option) : [...current.filter(i => i !== 'none'), option]);
    commitData({ ...data, [group]: { ...data[group], [field]: next } });
  };
  const toggleLock = (group, field) => {
    const next = { ...locks, [group]: { ...locks[group], [field]: !locks[group][field] } };
    locksRef.current = next; setLocks(next); commitData(data);
  };
  const unlockAll = () => {
    const next = getInitialLocks(); locksRef.current = next; setLocks(next); commitData(data); showToast('All unlocked', 'info');
  };
  const toggleGroup = (group) => setCollapsed(prev => ({ ...prev, [group]: !prev[group] }));
  const expandAll = () => setCollapsed(Object.keys(SCHEMA).reduce((a, k) => ({ ...a, [k]: false }), {}));
  const collapseAll = () => setCollapsed(Object.keys(SCHEMA).reduce((a, k) => ({ ...a, [k]: true }), {}));
  const resetSection = (group) => {
    const n = { ...data[group] };
    Object.keys(SCHEMA[group].fields).forEach(f => {
      if (!locks[group][f] && SCHEMA[group].fields[f].type !== 'const') n[f] = SCHEMA[group].fields[f].type === 'multi_select' ? [] : SCHEMA[group].fields[f].default;
    });
    commitData({ ...data, [group]: n });
  };
  const resetAll = () => {
    const n = JSON.parse(JSON.stringify(data));
    Object.keys(SCHEMA).forEach(g => Object.keys(SCHEMA[g].fields).forEach(f => {
      if (!locks[g][f] && SCHEMA[g].fields[f].type !== 'const') n[g][f] = SCHEMA[g].fields[f].type === 'multi_select' ? [] : SCHEMA[g].fields[f].default;
    }));
    commitData(n);
  };
  const applyPreset = (p) => {
    const pr = PRESETS.find(x => x.name === p); if (!pr) return;
    let n = JSON.parse(JSON.stringify(data));
    Object.entries(pr.values).forEach(([k, v]) => { const [g, f] = k.split('.'); if (!locks[g][f]) n[g][f] = v; });
    commitData(n);
  };
  const randomize = (target = null) => {
    let n = JSON.parse(JSON.stringify(data));
    const gs = target ? [target] : Object.keys(SCHEMA).filter(g => g !== 'reference_image');
    gs.forEach(g => Object.keys(SCHEMA[g].fields).forEach(f => {
      if (!locks[g][f]) {
        if (f === 'comics_character' && n.subject.archetype !== 'comics_characters') return;
        const sf = SCHEMA[g].fields[f];
        if (sf.type === 'select') {
          let opts = getAllowedOptions(g, f, n); if (opts.length === 0) opts = sf.options;
          n[g][f] = getRandomOption(opts);
        } else if (sf.type === 'boolean') {
          n[g][f] = g === 'negative' ? Math.random() > 0.1 : (f.startsWith('preserve_') ? true : Math.random() > 0.5);
        } else if (sf.type === 'multi_select') {
          const hasN = sf.options.includes('none'); const opts = sf.options.filter(o => o !== 'none');
          const r = Math.random();
          if (hasN && r < 0.1) n[g][f] = ['none']; else if (r < 0.25) n[g][f] = [];
          else n[g][f] = shuffleArray(opts).slice(0, 1 + Math.floor(Math.random() * 3));
        }
      }
    }));
    commitData(n, true);
  };
  const showToast = (m, t = 'info') => { setToast({ message: m, type: t }); setTimeout(() => setToast(null), 3000); };
  const addToBatch = () => { setJsonBatch(prev => [...prev, JSON.parse(JSON.stringify(data))]); showToast(`Added (${jsonBatch.length + 1})`, 'success'); };
  const clearBatch = () => { setJsonBatch([]); showToast('Batch cleared', 'info'); };
  const handleImport = (t) => {
    try {
      if (!t.trim()) return; const p = JSON.parse(t); const n = JSON.parse(JSON.stringify(data));
      const fl = (obj, pre = '') => Object.keys(obj).reduce((ac, k) => { const pr = pre ? pre + '.' : ''; if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) Object.assign(ac, fl(obj[k], pr + k)); else ac[pr + k] = obj[k]; return ac; }, {});
      const fi = fl(p);
      Object.entries(fi).forEach(([k, v]) => { updateStateAtPath(n, k, v); if (ALIAS_MAP[k]) updateStateAtPath(n, ALIAS_MAP[k], v); });
      NEGATIVE_ALIAS_KEYS.forEach(nk => {
         const v = ((obj, path) => { const pts = path.split('.'); let cur = obj; for (const pt of pts) { if (cur && cur[pt]) cur = cur[pt]; else return undefined; } return cur; })(p, nk);
         if (Array.isArray(v)) v.forEach(i => { const l = i.toLowerCase(); if (l.includes('text')) n.negative.no_text = true; if (l.includes('watermark')) n.negative.no_watermark = true; });
      });
      commitData(n); showToast('Imported', 'success'); return true;
    } catch (e) { return false; }
  };
  const generateJSONString = (id) => {
    const o = {}; const ord = ['meta', 'reference_image', 'subject', 'pose', 'apparel', 'accessories', 'scene', 'camera', 'lighting', 'style', 'output', 'negative'];
    ord.forEach(gk => {
      if (gk === 'reference_image' && !id.reference_image.enabled) return;
      const gd = {}; let hd = false;
      if (gk === 'reference_image') {
        gd.enabled = true; gd.require_attachment_later = id.reference_image.require_attachment_later; gd.fidelity = id.reference_image.fidelity;
        gd.preserve_full_face = id.reference_image.preserve_full_face; gd.preserve = {};
        Object.keys(id.reference_image).forEach(k => { if (k.startsWith('preserve_') && k !== 'preserve_full_face') gd.preserve[k.replace('preserve_', '')] = id.reference_image[k]; });
        gd.instructions = REFERENCE_INSTRUCTIONS; hd = true;
      } else {
        Object.keys(id[gk]).forEach(fk => {
          if (fk === 'comics_character' && id.subject.archetype !== 'comics_characters') return;
          const val = id[gk][fk]; const st = SCHEMA[gk].fields[fk].type;
          if (st === 'multi_select') { if (Array.isArray(val) && val.length > 0 && !val.includes('none')) { gd[fk] = val; hd = true; } return; }
          if (st === 'array_text') { if (typeof val === 'string' && val.trim()) { gd[fk] = val.split(',').map(s => s.trim()); hd = true; } return; }
          if (st === 'const' || (typeof val === 'string' && val.trim())) { gd[fk] = val; hd = true; } else if (typeof val === 'boolean') { gd[fk] = val; hd = true; }
        });
      }
      if (hd) o[gk] = gd;
    });
    return JSON.stringify(o, null, 2);
  };
  const jumpToConflict = () => { const k = Object.keys(conflicts)[0]; if (k) { const [g] = k.split('.'); setCollapsed(p => ({ ...p, [g]: false })); setTimeout(() => { const el = document.getElementById(`section-${g}`); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); setConflictModalOpen(false); } };
  const fixConflict = () => { const k = Object.keys(conflicts)[0]; if (k) { const [g, f] = k.split('.'); let opts = getAllowedOptions(g, f, data); if (opts.length === 0) opts = SCHEMA[g].fields[f].options; commitData({ ...data, [g]: { ...data[g], [f]: getRandomOption(opts) } }); setConflictModalOpen(false); } };

  return {
    data, locks, collapsed, toast, conflicts, jsonBatch, isMultiPanel, globalAspectRatio, conflictModalOpen, refDetailsOpen,
    handleValueChange, handleMultiSelectToggle, toggleLock, unlockAll, toggleGroup, resetSection, resetAll, applyPreset, randomize, handleImport, handleUndo,
    getAllowedOptions, addToBatch, clearBatch, generateJSONString, setIsMultiPanel, setGlobalAspectRatio, jumpToConflict, fixConflict, setConflictModalOpen, expandAll, collapseAll, toggleRefDetails
  };
};

// ==========================================
// SECTION 4: SUB-COMPONENTS
// ==========================================

const Toast = ({ toast }) => !toast ? null : (
  <div className={`fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-xl z-50 font-medium flex items-center gap-2 border animate-in fade-in slide-in-from-top-4 duration-300 ${toast.type === 'error' ? 'bg-red-900/90 border-red-700 text-white' : 'bg-green-900/90 border-green-700 text-white'}`}>
     {toast.type === 'success' && <Check size={16} />} {toast.message}
  </div>
);

const ImportModal = ({ onClose, onImport }) => {
  const [text, setText] = useState(''); const [error, setError] = useState(null);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Download size={20} className="text-blue-400" /> Import JSON</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>
        <div className="p-4 flex-1 flex flex-col gap-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder='Paste JSON here...' className="w-full flex-1 min-h-[300px] bg-black/50 border border-gray-700 rounded p-4 font-mono text-xs text-gray-300 focus:border-blue-500 outline-none resize-none" />
          {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-900/50">{error}</div>}
        </div>
        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded text-gray-400 hover:bg-gray-800 transition-colors">Cancel</button>
          <button onClick={() => onImport(text) ? onClose() : setError("Invalid JSON")} className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-900/20">Apply</button>
        </div>
      </div>
    </div>
  );
};

const ConflictModal = ({ onClose, onJump, onFix }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
    <div className="bg-gray-900 border border-amber-600 rounded-lg shadow-2xl w-full max-w-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-amber-900/20">
        <h3 className="text-lg font-bold text-amber-500 flex items-center gap-2"><AlertTriangle size={20} /> Logic Conflict</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={24} /></button>
      </div>
      <div className="p-6 text-sm text-gray-300">Randomization resulted in conflicts or violated locks.</div>
      <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
        <button onClick={onFix} className="px-4 py-2 rounded bg-gray-800 border border-gray-600">Re-randomize Conflicted</button>
        <button onClick={onJump} className="px-4 py-2 rounded bg-amber-600 text-white font-bold">Jump to Field</button>
      </div>
    </div>
  </div>
);

const FieldControl = ({ group, field, schema, value, isLocked, onUpdate, onMultiSelect, onLock, getAllowedOptions, data, conflict }) => {
  if (schema.type === 'const') return null;
  const displayOptions = schema.options ? (getAllowedOptions ? getAllowedOptions(group, field, data) : schema.options) : [];
  return (
    <div className={`flex flex-col gap-1.5 p-1.5 rounded-md transition-colors ${isLocked ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-gray-800 border border-transparent'}`}>
      <div className="flex items-center justify-between w-full px-0.5">
        <div className="flex items-center gap-1 min-w-0">
          <label className="text-[11px] text-gray-400 font-semibold truncate uppercase tracking-tighter">{schema.label}</label>
          {schema.description && (
            <div className="group relative shrink-0">
              <Info size={10} className="text-gray-600 hover:text-blue-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-800 border border-gray-700 rounded-md shadow-xl text-[10px] text-gray-200 z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all pointer-events-none">{schema.description}</div>
            </div>
          )}
          {conflict && (
            <div className="group relative shrink-0">
              <AlertTriangle size={10} className="text-amber-500 animate-pulse cursor-help" />
              <div className={`absolute left-0 bottom-full mb-2 w-48 p-2 rounded-md shadow-xl text-[10px] text-white z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all pointer-events-none ${conflict.isUnresolved ? 'bg-red-900 border border-red-700' : 'bg-amber-900 border border-amber-700'}`}>
                <strong>{conflict.isUnresolved ? 'Violation' : 'Corrected'}</strong><br/>Reason: {conflict.reason}
              </div>
            </div>
          )}
        </div>
        <button onClick={() => onLock(group, field)} className={`p-1 rounded-md ${isLocked ? 'text-amber-500 bg-amber-500/20' : 'text-gray-600 hover:bg-gray-700'}`}>{isLocked ? <Lock size={12} /> : <Unlock size={12} />}</button>
      </div>
      <div className="w-full">
        {schema.type === 'select' && (
          <select disabled={isLocked} value={value} onChange={(e) => onUpdate(group, field, e.target.value)} className="w-full bg-gray-900 text-gray-200 text-xs rounded border border-gray-700 focus:border-blue-500 h-7 px-1 disabled:opacity-50">
            {!displayOptions.includes(value) && value !== '' && <option value={value} disabled>{typeof value === 'string' ? value.replace(/_/g, ' ') : value} (Invalid)</option>}
            {displayOptions.map(opt => (<option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>))}
          </select>
        )}
        {schema.type === 'multi_select' && (
          <div className="flex flex-wrap gap-1">
            {displayOptions.map(opt => {
              const isActive = Array.isArray(value) && value.includes(opt);
              return (
                <button key={opt} disabled={isLocked} onClick={() => onMultiSelect(group, field, opt)} className={`px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-full border transition-all ${isActive ? (opt === 'none' ? 'bg-amber-900/60 text-amber-100 border-amber-600' : 'bg-blue-600 text-white border-blue-600') : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500'}`}>{opt.replace(/_/g, ' ')}</button>
              );
            })}
          </div>
        )}
        {schema.type === 'text' && <input type="text" disabled={isLocked} maxLength={schema.maxLength || 999} value={value || ''} onChange={(e) => onUpdate(group, field, e.target.value)} placeholder="..." className="w-full bg-gray-900 text-gray-200 text-xs rounded border border-gray-700 h-7 px-2" />}
        {schema.type === 'boolean' && (
          <button disabled={isLocked} onClick={() => onUpdate(group, field, !value)} className={`w-full text-xs h-7 px-2 rounded flex items-center justify-between ${value ? 'bg-blue-900/30 text-blue-200' : 'bg-gray-900 text-gray-500'}`}><span>{value ? 'Yes' : 'No'}</span><div className={`w-2 h-2 rounded-full ${value ? 'bg-blue-500' : 'bg-gray-600'}`} /></button>
        )}
      </div>
    </div>
  );
};

const ControlSection = ({ groupKey, groupSchema, data, locks, conflicts, collapsed, onToggle, onRandomize, onReset, onUpdate, onMultiSelect, onLock, getAllowedOptions, toggleRefDetails, refDetailsOpen }) => (
    <div id={`section-${groupKey}`} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm">
      <div className="flex items-center justify-between p-2.5 bg-gray-900 hover:bg-gray-800/50 cursor-pointer border-b border-gray-800/50" onClick={() => onToggle(groupKey)}>
        <div className="flex items-center gap-2">
          {collapsed ? <ChevronRight size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
          <h3 className="font-bold text-gray-200 text-[11px] uppercase tracking-wider">{groupSchema.title}</h3>
          {groupKey === 'reference_image' && <span className={`text-[9px] px-1 rounded font-black ${data.reference_image.enabled ? 'bg-green-900/40 text-green-400' : 'bg-gray-800 text-gray-600'}`}>{data.reference_image.enabled ? 'ON' : 'OFF'}</span>}
        </div>
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          {groupKey !== 'reference_image' && <button onClick={() => onRandomize(groupKey)} className="p-1 text-gray-500 hover:text-blue-400"><RefreshCw size={12} /></button>}
          <button onClick={() => onReset(groupKey)} className="p-1 text-gray-500 hover:text-red-400"><RotateCcw size={12} /></button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-2 grid grid-cols-2 gap-2">
          {Object.entries(groupSchema.fields).map(([fk, fs]) => {
               if (groupKey === 'reference_image') {
                   if (['fidelity', 'require_attachment_later', 'preserve_full_face'].includes(fk) && !data.reference_image.enabled) return null;
                   if (fk.startsWith('preserve_') && fk !== 'preserve_full_face' && (!data.reference_image.enabled || !refDetailsOpen)) return null;
               }
               if (groupKey === 'subject' && fk === 'comics_character' && data.subject.archetype !== 'comics_characters') return null;
               return <div key={fk} className={fs.type === 'text' || fs.type === 'multi_select' ? 'col-span-2' : ''}><FieldControl group={groupKey} field={fk} schema={fs} value={data[groupKey][fk]} isLocked={locks[groupKey][fk]} conflict={conflicts[`${groupKey}.${fk}`]} onUpdate={onUpdate} onMultiSelect={onMultiSelect} onLock={onLock} getAllowedOptions={getAllowedOptions} data={data} /></div>;
          })}
          {groupKey === 'reference_image' && data.reference_image.enabled && <div className="col-span-2 flex justify-center py-1"><button onClick={toggleRefDetails} className="text-[10px] text-blue-400 flex items-center gap-1 bg-gray-800 px-2 py-0.5 rounded-full">{refDetailsOpen ? <ChevronsUp size={10}/> : <ChevronsDown size={10}/>} {refDetailsOpen ? 'Hide Advanced' : 'Advanced Settings'}</button></div>}
        </div>
      )}
    </div>
);

// ==========================================
// SECTION 5: MAIN APP COMPONENT
// ==========================================

export default function GeminiCanvas() {
  const { data, locks, collapsed, toast, conflicts, jsonBatch, isMultiPanel, globalAspectRatio, conflictModalOpen, refDetailsOpen, handleValueChange, handleMultiSelectToggle, toggleLock, unlockAll, toggleGroup, resetSection, resetAll, applyPreset, randomize, handleImport, handleUndo, getAllowedOptions, addToBatch, clearBatch, generateJSONString, setIsMultiPanel, setGlobalAspectRatio, jumpToConflict, fixConflict, setConflictModalOpen, expandAll, collapseAll, toggleRefDetails } = usePromptEngine();
  const [showImport, setShowImport] = useState(false); const [copied, setCopied] = useState(false);
  const getOutputString = useCallback(() => {
    let b = jsonBatch.length > 0 ? jsonBatch.map(d => generateJSONString(d)).join('\n\n') : generateJSONString(data);
    if (isMultiPanel) b += `\n\nCreate a single image that is a multi panels collage, each panel is according to a different JSON block from the above JSON\nThis image has Aspect Ratio of ${globalAspectRatio}`;
    if (data.reference_image.enabled) b += '\n\nuse the uploaded face image as the exact facial reference (same facial structure, eyes, nose, lips, skin tone)';
    return b;
  }, [jsonBatch, data, isMultiPanel, globalAspectRatio, generateJSONString]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-blue-500/30 relative">
      <Toast toast={toast} />
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      {conflictModalOpen && <ConflictModal onClose={() => setConflictModalOpen(false)} onJump={jumpToConflict} onFix={fixConflict} />}
      <header className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur border-b border-gray-800 p-3 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center text-gray-900 font-bold"><Zap size={20} /></div><div><h1 className="text-base font-black text-white leading-tight uppercase tracking-tighter">Gemini Canvas</h1><p className="text-[10px] text-gray-500 font-mono">Refactor-v3 | Nano Banana Pro</p></div></div>
          <div className="flex items-center gap-2">
            <select onChange={(e) => { applyPreset(e.target.value); e.target.value = ""; }} className="bg-gray-800 text-blue-400 text-xs px-3 py-1.5 rounded border border-gray-700 outline-none" defaultValue=""><option value="" disabled>Apply Preset...</option>{PRESETS.map(p => (<option key={p.name} value={p.name}>{p.name}</option>))}</select>
            <div className="h-6 w-px bg-gray-700 mx-1"></div>
            <button onClick={() => setShowImport(true)} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs border border-gray-700"><Download size={14} /> Import</button>
            <button onClick={() => randomize(null)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-bold"><RefreshCw size={14} /> Randomize</button>
            <button onClick={unlockAll} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs border border-gray-700"><Unlock size={14} /> Unlock All</button>
            <button onClick={resetAll} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs border border-gray-700"><RotateCcw size={14} /> Reset All</button>
            <button onClick={handleUndo} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-md text-xs border border-gray-700"><Undo2 size={14} /> Undo</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-3 bg-gray-900"><div className="flex items-center gap-2 text-blue-400"><Grid size={16} /><h3 className="font-bold text-gray-200 text-xs uppercase tracking-wider">Multi Panels</h3></div><button onClick={() => setIsMultiPanel(!isMultiPanel)} className={`w-8 h-4 flex items-center rounded-full p-0.5 duration-300 ${isMultiPanel ? 'bg-blue-600' : 'bg-gray-700'}`}><div className={`bg-white w-3 h-3 rounded-full transform duration-300 ${isMultiPanel ? 'translate-x-4' : ''}`} /></button></div>
            {isMultiPanel && <div className="p-3 border-t border-gray-800 flex items-center gap-2"><label className="text-[10px] text-gray-400 font-bold uppercase">Aspect Ratio:</label><select value={globalAspectRatio} onChange={e => setGlobalAspectRatio(e.target.value)} className="bg-gray-800 text-gray-200 text-xs rounded border border-gray-700 py-1 px-2">{['1:1', '2:3', '3:2', '9:16', '16:9'].map(o => <option key={o} value={o}>{o}</option>)}</select></div>}
          </div>
          <div className="flex justify-between px-1"><button onClick={expandAll} className="flex items-center gap-1 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest"><ChevronsDown size={12} /> Expand All</button><button onClick={collapseAll} className="flex items-center gap-1 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest"><ChevronsUp size={12} /> Collapse All</button></div>
          {Object.entries(SCHEMA).map(([gk, gs]) => (<ControlSection key={gk} groupKey={gk} groupSchema={gs} data={data} locks={locks} conflicts={conflicts} collapsed={collapsed[gk]} onToggle={toggleGroup} onRandomize={randomize} onReset={resetSection} onUpdate={handleValueChange} onMultiSelect={handleMultiSelectToggle} onLock={toggleLock} getAllowedOptions={getAllowedOptions} toggleRefDetails={toggleRefDetails} refDetailsOpen={refDetailsOpen} />))}
        </div>
        <div className="lg:col-span-5"><div className="sticky top-24"><div className="bg-[#0d1117] border border-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]"><div className="flex items-center justify-between p-2.5 border-b border-gray-800 bg-gray-900/50"><span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{jsonBatch.length > 0 ? `BATCH (${jsonBatch.length})` : 'LIVE PREVIEW'}</span>{jsonBatch.length > 0 && <button onClick={clearBatch} className="text-red-400 hover:text-red-300"><Trash2 size={12} /></button>}<div className="flex items-center gap-2"><button onClick={addToBatch} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-gray-800 text-blue-400 border border-gray-700 hover:bg-gray-700"><Plus size={12} /> Batch</button><button onClick={handleCopy} className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${copied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'COPIED' : 'COPY'}</button></div></div><div className="flex-1 overflow-auto p-4 custom-scrollbar"><pre className="font-mono text-xs text-green-400 whitespace-pre-wrap break-all leading-relaxed">{getOutputString()}</pre></div><div className="p-2 border-t border-gray-800 bg-gray-900/50 text-[9px] text-gray-600 text-center font-bold tracking-widest uppercase">Nano Banana Pro JSON Compiler</div></div></div></div>
      </main>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #0d1117; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }`}</style>
    </div>
  );
}
```eof

### Change Log: Refactor-v3.1
* **Schema:** Removed `preserve_freckles_moles_scars`. 
* **UI Update:** Implemented "Advanced Settings" toggle inside the Reference Image group to hide/show specific preservation flags.
* **Prompting:** Added auto-append string for face reference instructions when Reference Image is enabled.
* **Subject:** Added `Hair Color` dropdown.
* **Logic Fix:** Resolved gender/character conflicts for Comics Characters (e.g., Male Lex Luthor is valid, Female Lex Luthor triggers a correction).
* **Value Expansions:** Added new locations (Park, Subway, Cafe), shot types (Cowboy, Knee), and angles (Dutch, Worm Eye).
* **Navigation:** Added explicit "Expand All" and "Collapse All" buttons.
* **Styling:** Shrinked chip sizes and refined dropdown aesthetics for a tighter, professional look.
* **Multi-Panel:** Fixed Aspect Ratio dropdown values and appended correct AR text to the output.
* **Resolution:** Updated values to HD, 2K, 4K.
* **Undo:** Integrated "Undo" button next to "Reset All".