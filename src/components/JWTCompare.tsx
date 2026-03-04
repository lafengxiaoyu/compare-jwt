import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as diff from 'diff';

interface TranslationFunction {
  (key: string, params?: Record<string, string | number>): string;
}

interface JWTCompareProps {
  t: TranslationFunction;
}

// Base64 decode helper for browser
const base64Decode = (str: string): string => {
  try {
    // Handle URL-safe Base64
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    // Decode using atob
    const decoded = atob(base64);
    // Handle UTF-8
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (err) {
    // Fallback: try simple decode
    try {
      return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
    } catch {
      throw new Error('Failed to decode base64');
    }
  }
};

const JWTCompare: React.FC<JWTCompareProps> = ({ t }) => {
  const [jwt1, setJwt1] = useState('');
  const [jwt2, setJwt2] = useState('');
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [error, setError] = useState('');

  const decodeJWT = (token: string) => {
    try {
      const parts = token.trim().split('.');
      
      if (parts.length === 3) {
        // Standard JWT (JWS)
        const decoded = jwtDecode(token);
        return JSON.stringify(decoded, null, 2);
      } else if (parts.length === 2) {
        // JWT without signature (header.payload only)
        const payload = JSON.parse(base64Decode(parts[1]));
        const header = JSON.parse(base64Decode(parts[0]));
        return JSON.stringify({
          header: header,
          payload: payload,
          note: 'This JWT has no signature part (2 parts only)'
        }, null, 2);
      } else if (parts.length === 5) {
        // JWE (JSON Web Encryption) - can't decrypt without private key
        // Decode only the header
        const header = JSON.parse(base64Decode(parts[0]));
        return JSON.stringify({
          type: 'JWE (Encrypted)',
          header: header,
          note: 'This is an encrypted JWE. Only the header can be decoded without the decryption key.',
          structure: {
            header: parts[0].substring(0, 50) + '...',
            encryptedKey: parts[1].substring(0, 30) + '...',
            iv: parts[2].substring(0, 30) + '...',
            ciphertext: parts[3].substring(0, 30) + '...',
            authTag: parts[4].substring(0, 30) + '...'
          }
        }, null, 2);
      } else {
        throw new Error(`Invalid token format: expected 2 parts (JWT no sig), 3 parts (JWT), or 5 parts (JWE), got ${parts.length} parts`);
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Invalid JWT/JWE token');
    }
  };

  const handleCompare = () => {
    setError('');
    setDiffResult([]);

    if (!jwt1.trim() || !jwt2.trim()) {
      setError(t('jwtCompare.emptyError'));
      return;
    }

    try {
      const json1 = decodeJWT(jwt1);
      const json2 = decodeJWT(jwt2);

      const changes = diff.diffLines(json1, json2);
      setDiffResult(changes);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.parseFailed'));
    }
  };

  const renderDiff = () => {
    if (diffResult.length === 0) return null;

    let leftLineNum = 1;
    let rightLineNum = 1;
    const leftLines: JSX.Element[] = [];
    const rightLines: JSX.Element[] = [];

    diffResult.forEach((part, index) => {
      const lines = part.value.split('\n');
      // Remove last empty line if exists
      if (lines[lines.length - 1] === '') {
        lines.pop();
      }

      lines.forEach((line, lineIndex) => {
        if (part.added) {
          rightLines.push(
            <div key={`right-${index}-${lineIndex}`} className="diff-line added">
              <div className="diff-line-num">{rightLineNum}</div>
              <div className="diff-line-content">+ {line}</div>
            </div>
          );
          rightLineNum++;
        } else if (part.removed) {
          leftLines.push(
            <div key={`left-${index}-${lineIndex}`} className="diff-line removed">
              <div className="diff-line-num">{leftLineNum}</div>
              <div className="diff-line-content">- {line}</div>
            </div>
          );
          leftLineNum++;
        } else {
          // Unchanged - add to both sides
          leftLines.push(
            <div key={`left-${index}-${lineIndex}`} className="diff-line unchanged">
              <div className="diff-line-num">{leftLineNum}</div>
              <div className="diff-line-content">  {line}</div>
            </div>
          );
          leftLineNum++;

          rightLines.push(
            <div key={`right-${index}-${lineIndex}`} className="diff-line unchanged">
              <div className="diff-line-num">{rightLineNum}</div>
              <div className="diff-line-content">  {line}</div>
            </div>
          );
          rightLineNum++;
        }
      });
    });

    // Balance the lines
    const maxLines = Math.max(leftLines.length, rightLines.length);
    while (leftLines.length < maxLines) {
      leftLines.push(
        <div key={`left-empty-${leftLines.length}`} className="diff-line">
          <div className="diff-line-num"></div>
          <div className="diff-line-content"></div>
        </div>
      );
    }
    while (rightLines.length < maxLines) {
      rightLines.push(
        <div key={`right-empty-${rightLines.length}`} className="diff-line">
          <div className="diff-line-num"></div>
          <div className="diff-line-content"></div>
        </div>
      );
    }

    return (
      <div className="diff-container">
        <div className="diff-header">
          <h3>{t('jwtCompare.decodedHeader')}</h3>
          <h3>{t('jwtCompare.decodedHeader2')}</h3>
        </div>
        <div className="diff-content">
          <div className="diff-side">{leftLines}</div>
          <div className="diff-side">{rightLines}</div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="input-section">
        <div className="input-box">
          <h3>{t('jwtCompare.title')}</h3>
          <textarea
            placeholder={t('jwtCompare.placeholder1')}
            value={jwt1}
            onChange={(e) => setJwt1(e.target.value)}
          />
          <div style={{ marginTop: '8px', color: '#8b949e', fontSize: '12px' }}>
            {t('jwtCompare.hint')}
          </div>
        </div>
        <div className="input-box">
          <h3>{t('jwtCompare.title2')}</h3>
          <textarea
            placeholder={t('jwtCompare.placeholder2')}
            value={jwt2}
            onChange={(e) => setJwt2(e.target.value)}
          />
          <div style={{ marginTop: '8px', color: '#8b949e', fontSize: '12px' }}>
            {t('jwtCompare.hint')}
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button className="compare-btn" onClick={handleCompare}>
        {t('jwtCompare.button')}
      </button>

      {diffResult.length > 0 && renderDiff()}
    </div>
  );
};

export default JWTCompare;
