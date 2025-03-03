import React from 'react';
import { Bot } from 'lucide-react';

// Default icon for unknown providers
function getDefaultIcon(size: number, className: string = '') {
  return {
    provider: 'Unknown',
    color: '#888888',
    icon: <div className="bg-white rounded-full flex items-center justify-center border-2 border-[#888888] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
      <Bot size={size * 0.7} className={`text-[#888888] ${className}`} />
    </div>
  };
}

interface ModelLogoProps {
  modelName: string;
  className?: string;
  size?: number;
}

const ModelLogo: React.FC<ModelLogoProps> = ({ modelName, className = '', size = 24 }) => {
  // Determine which provider the model belongs to
  const getProviderInfo = () => {
    const lowerName = modelName.toLowerCase();
    
    if (lowerName.includes('gemini')) {
      return {
        provider: 'Google',
        color: '#4285F4',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#4285F4] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://media.licdn.com/dms/image/v2/D560BAQHwFiXHVZqcpA/company-logo_200_200/company-logo_200_200/0/1704352802668?e=2147483647&v=beta&t=pe9LRKD3jwxHyazkswfWDa9KWIyBTg2wbOYMnDwQ-nI" 
            alt="Gemini AI" 
            className={`${className} object-cover`} 
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('mistral')) {
      return {
        provider: 'Mistral',
        color: '#9C27B0',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#9C27B0] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://res.cloudinary.com/apideck/image/upload/v1702333454/marketplaces/ckhg56iu1mkpc0b66vj7fsj3o/listings/1701285827271_q0bcc6.jpg" 
            alt="Mistral AI" 
            className={`${className} object-cover`} 
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('deepseek')) {
      return {
        provider: 'Deepseek',
        color: '#0066FF',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#0066FF] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://images.seeklogo.com/logo-png/61/1/deepseek-ai-icon-logo-png_seeklogo-611473.png" 
            alt="Deepseek AI"
            className={`${className} object-cover`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('moonshot')) {
      return {
        provider: 'Moonshot',
        color: '#FF6B6B',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#FF6B6B] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://media.licdn.com/dms/image/v2/D560BAQHwFiXHVZqcpA/company-logo_200_200/company-logo_200_200/0/1704352802668?e=2147483647&v=beta&t=pe9LRKD3jwxHyazkswfWDa9KWIyBTg2wbOYMnDwQ-nI" 
            alt="Moonshot AI"
            className={`${className} object-cover`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('llama')) {
      return {
        provider: 'Meta',
        color: '#0668E1',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#0668E1] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://simplifyai.in/wp-content/uploads/2024/07/Meta-ai-logo.png" 
            alt="Meta AI"
            className={`${className} object-cover`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('phi')) {
      return {
        provider: 'Microsoft',
        color: '#00A4EF',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#00A4EF] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://pngimg.com/uploads/microsoft/microsoft_PNG5.png" 
            alt="Microsoft"
            className={`${className} object-cover`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('claude')) {
      return {
        provider: 'Anthropic',
        color: '#FF6F00',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#FF6F00] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png" 
            alt="Claude AI"
            className={`${className} object-cover`}
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else if (lowerName.includes('gpt')) {
      return {
        provider: 'OpenAI',
        color: '#10a37f',
        icon: <div className="bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-[#10a37f] border-opacity-20" style={{ width: `${size}px`, height: `${size}px` }}>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png" 
            alt="OpenAI" 
            className={`${className} object-cover`} 
            style={{ width: `${size}px`, height: `${size}px` }}
          />
        </div>
      };
    } else {
      return getDefaultIcon(size, className);
    }
  };

  const { icon } = getProviderInfo();
  
  return icon;
};

export default ModelLogo;