/**
 * VitePress OER Schema Plugin
 * Adds pedagogical components with OER Schema microdata
 */
import container from 'markdown-it-container'

export function oerSchemaPlugin(md) {
  // Learning Objective component
  md.use(container, 'learning-objective', {
    validate: function(params) {
      return params.trim().match(/^learning-objective\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^learning-objective\s+(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
      
      if (tokens[idx].nesting === 1) {
        // Parse attributes
        const skill = attrs.skill || '';
        const course = attrs.course || '';
        
        return `<div class="oer-learning-objective" itemscope itemtype="http://oerschema.org/LearningObjective">
  ${skill ? `<meta itemprop="skill" content="${escapeHtml(skill)}" />` : ''}
  ${course ? `<meta itemprop="forCourse" content="${escapeHtml(course)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">🎯 Learning Objective</h3>
  </div>
  <div class="oer-component-content" itemprop="description">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.skill ? `<span class="oer-tag">Skill: ${escapeHtml(attrs.skill)}</span>` : ''}
    ${attrs.course ? `<span class="oer-tag">Course: ${escapeHtml(attrs.course)}</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Assessment component
  md.use(container, 'assessment', {
    validate: function(params) {
      return params.trim().match(/^assessment\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^assessment\s+(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
      
      if (tokens[idx].nesting === 1) {
        return `<div class="oer-assessment" itemscope itemtype="http://oerschema.org/Assessment">
  ${attrs.type ? `<meta itemprop="additionalType" content="${escapeHtml(attrs.type)}" />` : ''}
  ${attrs.points ? `<meta itemprop="gradingFormat" content="${escapeHtml(attrs.points)} points" />` : ''}
  ${attrs.assessing ? `<link itemprop="assessing" href="#${escapeHtml(attrs.assessing)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📝 Assessment</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${attrs.type ? `<span class="oer-tag">${escapeHtml(attrs.type)}</span>` : ''}
    ${attrs.points ? `<span class="oer-tag">${escapeHtml(attrs.points)} points</span>` : ''}
  </div>
</div>\n`;
      }
    }
  });

  // Practice Task component
  md.use(container, 'practice', {
    validate: function(params) {
      return params.trim().match(/^practice\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^practice\s+(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
      const actions = attrs.action ? attrs.action.split(',').map(a => a.trim()) : [];
      
      if (tokens[idx].nesting === 1) {
        return `<div class="oer-practice" itemscope itemtype="http://oerschema.org/Practice">
  ${actions.map(action => `<link itemprop="typeOfAction" href="http://oerschema.org/${escapeHtml(action)}" />`).join('\n  ')}
  ${attrs.material ? `<div itemprop="material" itemscope itemtype="http://oerschema.org/SupportingMaterial">
    <meta itemprop="name" content="${escapeHtml(attrs.material)}" />
  </div>` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">🔬 Practice</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
  <div class="oer-component-meta">
    ${actions.map(action => `<span class="oer-tag">${escapeHtml(action)}</span>`).join('')}
  </div>
</div>\n`;
      }
    }
  });

  // Learning Component with Reflection
  md.use(container, 'learning-component', {
    validate: function(params) {
      return params.trim().match(/^learning-component\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^learning-component\s+(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
      
      if (tokens[idx].nesting === 1) {
        return `<div class="oer-learning-component" itemscope itemtype="http://oerschema.org/LearningComponent">
  ${attrs.objective ? `<link itemprop="hasLearningObjective" href="#${escapeHtml(attrs.objective)}" />` : ''}
  <div itemscope itemtype="http://oerschema.org/Task">
    ${attrs.action ? `<link itemprop="typeOfAction" href="http://oerschema.org/${escapeHtml(attrs.action)}" />` : ''}
    <div class="oer-component-header">
      <h3 class="oer-component-title">💭 Learning Component</h3>
    </div>
    <div class="oer-component-content">`;
      } else {
        return `    </div>
    <div class="oer-component-meta">
      ${attrs.action ? `<span class="oer-tag">${escapeHtml(attrs.action)} ActionType</span>` : ''}
      <span class="oer-tag">LearningComponent</span>
    </div>
  </div>
</div>\n`;
      }
    }
  });

  // Instructional Pattern component
  md.use(container, 'instructional-pattern', {
    validate: function(params) {
      return params.trim().match(/^instructional-pattern\s+(.*)$/);
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^instructional-pattern\s+(.*)$/);
      const attrs = parseAttributes(m && m.length > 1 ? m[1] : '');
      
      if (tokens[idx].nesting === 1) {
        return `<div class="oer-instructional-pattern" itemscope itemtype="http://oerschema.org/InstructionalPattern">
  ${attrs.type ? `<meta itemprop="additionalType" content="${escapeHtml(attrs.type)}" />` : ''}
  ${attrs.title ? `<meta itemprop="name" content="${escapeHtml(attrs.title)}" />` : ''}
  <div class="oer-component-header">
    <h3 class="oer-component-title">📚 ${attrs.type || 'Instructional Pattern'}: ${attrs.title || ''}</h3>
  </div>
  <div class="oer-component-content">`;
      } else {
        return `  </div>
</div>\n`;
      }
    }
  });
}

/**
 * Parse attribute string like: skill="value" course="another value"
 */
function parseAttributes(str) {
  const attrs = {};
  const regex = /(\w+)=["']([^"']*?)["']/g;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    attrs[match[1]] = match[2];
  }
  
  return attrs;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
