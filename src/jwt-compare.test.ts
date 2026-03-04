import { describe, it, expect } from 'vitest';
import * as diff from 'diff';

// JWT 解码函数（从 JWTCompare.tsx 复制）
function base64Decode(str: string): string {
  try {
    // 将 base64url 转换为 base64
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // 补全 padding
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const decoded = atob(base64);
    
    // 尝试处理 UTF-8 编码
    try {
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch {
      return decoded;
    }
  } catch (error) {
    throw new Error(`Base64 decode failed: ${error}`);
  }
}

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    
    if (parts.length < 2) {
      throw new Error(`Invalid token format: expected 2, 3 or 5 parts, got ${parts.length}`);
    }
    
    // 解码 header
    const header = JSON.parse(base64Decode(parts[0]));
    
    // 解码 payload（总是第2部分）
    const payload = JSON.parse(base64Decode(parts[1]));
    
    return {
      header,
      payload,
      tokenType: parts.length === 5 ? 'JWE' : (parts.length === 3 ? 'JWT' : 'JWT (no signature)')
    };
  } catch (error) {
    throw new Error(`JWT decode failed: ${error}`);
  }
}

function formatJSON(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

function compareJWTs(token1: string, token2: string): {
  decoded1: any;
  decoded2: any;
  diff: diff.Change[];
} {
  const decoded1 = decodeJWT(token1);
  const decoded2 = decodeJWT(token2);
  
  const str1 = formatJSON(decoded1.payload);
  const str2 = formatJSON(decoded2.payload);
  
  const diffResult = diff.diffLines(str1, str2);
  
  return {
    decoded1,
    decoded2,
    diff: diffResult
  };
}

describe('JWT Comparison Test', () => {
  it('should compare two JWT tokens and detect version change and new API', () => {
    const token1 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5pZmVzdFZlcnNpb24iOiIxLjAiLCJuYW1lIjoiTW9jayBBUEkgTWFuaWZlc3QiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJhcGlzIjpbeyJuYW1lIjoiZ2V0VXNlciIsIm1ldGhvZCI6IkdFVCIsImVuZHBvaW50IjoiL2FwaS92MS91c2Vycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9LHsibmFtZSI6ImNyZWF0ZU9yZGVyIiwibWV0aG9kIjoiUE9TVCIsImVuZHBvaW50IjoiL2FwaS92MS9vcmRlcnMiLCJhdXRoIjoiQmVhcmVyIn0seyJuYW1lIjoiaGVhbHRoQ2hlY2siLCJtZXRob2QiOiJHRVQiLCJlbmRwb2ludCI6Ii9oZWFsdGgiLCJhdXRoIjoiTm9uZSJ9XSwiaXNzdWVkQXQiOjE3MTAwMDAwMDB9';
    const token2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5pZmVzdFZlcnNpb24iOiIxLjEiLCJuYW1lIjoiTW9jayBBUEkgTWFuaWZlc3QiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJhcGlzIjpbeyJuYW1lIjoiZ2V0VXNlciIsIm1ldGhvZCI6IkdFVCIsImVuZHBvaW50IjoiL2FwaS92MS91c2Vycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9LHsibmFtZSI6ImNyZWF0ZU9yZGVyIiwibWV0aG9kIjoiUE9TVCIsImVuZHBvaW50IjoiL2FwaS92MS9vcmRlcnMiLCJhdXRoIjoiQmVhcmVyIn0seyJuYW1lIjoiaGVhbHRoQ2hlY2siLCJtZXRob2QiOiJHRVQiLCJlbmRwb2ludCI6Ii9oZWFsdGgiLCJhdXRoIjoiTm9uZSJ9LHsibmFtZSI6ImRlbGV0ZU9yZGVyIiwibWV0aG9kIjoiREVMRVRFIiwiZW5kcG9pbnQiOiIvYXBpL3YxL29yZGVycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9XSwiaXNzdWVkQXQiOjE3MTAwMDAwMDB9';

    const result = compareJWTs(token1, token2);
    
    // 验证解码成功
    expect(result.decoded1.payload.manifestVersion).toBe('1.0');
    expect(result.decoded2.payload.manifestVersion).toBe('1.1');
    
    // 验证 API 数量
    expect(result.decoded1.payload.apis).toHaveLength(3);
    expect(result.decoded2.payload.apis).toHaveLength(4);
    
    // 统计差异
    let addedLines = 0;
    let removedLines = 0;
    let changes: string[] = [];
    
    result.diff.forEach(part => {
      if (part.added) {
        addedLines += part.value.split('\n').filter(l => l.trim()).length;
        part.value.split('\n').forEach(line => {
          if (line.includes('manifestVersion')) {
            changes.push(`Version change: ${line.trim()}`);
          }
          if (line.includes('deleteOrder')) {
            changes.push(`New API: ${line.trim()}`);
          }
        });
      }
      if (part.removed) {
        removedLines += part.value.split('\n').filter(l => l.trim()).length;
      }
    });
    
    // 验证检测到的变化
    expect(changes.length).toBeGreaterThan(0);
    expect(changes.some(c => c.includes('manifestVersion'))).toBe(true);
    expect(changes.some(c => c.includes('deleteOrder'))).toBe(true);
    
    // 打印差异信息（用于调试）
    console.log('\n=== JWT Comparison Result ===');
    console.log(`Token 1 Version: ${result.decoded1.payload.manifestVersion}`);
    console.log(`Token 2 Version: ${result.decoded2.payload.manifestVersion}`);
    console.log(`Token 1 APIs: ${result.decoded1.payload.apis.length}`);
    console.log(`Token 2 APIs: ${result.decoded2.payload.apis.length}`);
    console.log(`\nDetected Changes:`);
    changes.forEach(c => console.log(`  - ${c}`));
    
    console.log('\n=== Diff Output ===');
    result.diff.forEach(part => {
      if (part.added) {
        process.stdout.write(part.value.split('\n').map(l => `+ ${l}`).join('\n'));
      } else if (part.removed) {
        process.stdout.write(part.value.split('\n').map(l => `- ${l}`).join('\n'));
      }
    });
  });

  it('should correctly decode JWT tokens', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYW5pZmVzdFZlcnNpb24iOiIxLjAiLCJuYW1lIjoiTW9jayBBUEkgTWFuaWZlc3QiLCJlbnZpcm9ubWVudCI6InByb2R1Y3Rpb24iLCJhcGlzIjpbeyJuYW1lIjoiZ2V0VXNlciIsIm1ldGhvZCI6IkdFVCIsImVuZHBvaW50IjoiL2FwaS92MS91c2Vycy97aWR9IiwiYXV0aCI6IkJlYXJlciJ9LHsibmFtZSI6ImNyZWF0ZU9yZGVyIiwibWV0aG9kIjoiUE9TVCIsImVuZHBvaW50IjoiL2FwaS92MS9vcmRlcnMiLCJhdXRoIjoiQmVhcmVyIn0seyJuYW1lIjoiaGVhbHRoQ2hlY2siLCJtZXRob2QiOiJHRVQiLCJlbmRwb2ludCI6Ii9oZWFsdGgiLCJhdXRoIjoiTm9uZSJ9XSwiaXNzdWVkQXQiOjE3MTAwMDAwMDB9';
    
    const decoded = decodeJWT(token);
    
    expect(decoded.header).toBeDefined();
    expect(decoded.payload).toBeDefined();
    expect(decoded.payload.manifestVersion).toBe('1.0');
    expect(decoded.payload.name).toBe('Mock API Manifest');
    expect(decoded.payload.environment).toBe('production');
    expect(decoded.payload.apis).toBeInstanceOf(Array);
    expect(decoded.payload.apis).toHaveLength(3);
  });
});
