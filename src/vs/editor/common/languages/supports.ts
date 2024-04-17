/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LineTokens } from 'vs/editor/common/tokens/lineTokens';
import { StandardTokenType } from 'vs/editor/common/encodedTokenAttributes';

export function createScopedLineTokens(context: LineTokens, offset: number): ScopedLineTokens {
	const tokenCount = context.getCount();
	const tokenIndex = context.findTokenIndexAtOffset(offset);
	const desiredLanguageId = context.getLanguageId(tokenIndex);

	let lastTokenIndex = tokenIndex;
	while (lastTokenIndex + 1 < tokenCount && context.getLanguageId(lastTokenIndex + 1) === desiredLanguageId) {
		lastTokenIndex++;
	}

	let firstTokenIndex = tokenIndex;
	while (firstTokenIndex > 0 && context.getLanguageId(firstTokenIndex - 1) === desiredLanguageId) {
		firstTokenIndex--;
	}

	return new ScopedLineTokens(
		context,
		desiredLanguageId,
		firstTokenIndex,
		lastTokenIndex + 1,
		context.getStartOffset(firstTokenIndex),
		context.getEndOffset(lastTokenIndex)
	);
}

export class ScopedLineTokens {
	_scopedLineTokensBrand: void = undefined;

	public readonly languageId: string;
	private readonly _actual: LineTokens;
	public readonly firstTokenIndex: number;
	private readonly _lastTokenIndex: number;
	public readonly firstCharOffset: number;
	private readonly _lastCharOffset: number;

	constructor(
		actual: LineTokens,
		languageId: string,
		firstTokenIndex: number,
		lastTokenIndex: number,
		firstCharOffset: number,
		lastCharOffset: number
	) {
		this._actual = actual;
		this.languageId = languageId;
		this.firstTokenIndex = firstTokenIndex;
		this._lastTokenIndex = lastTokenIndex;
		this.firstCharOffset = firstCharOffset;
		this._lastCharOffset = lastCharOffset;
	}

	public getLineContent(): string {
		const actualLineContent = this._actual.getLineContent();
		return actualLineContent.substring(this.firstCharOffset, this._lastCharOffset);
	}

	public getActualLineContentBefore(offset: number): string {
		const actualLineContent = this._actual.getLineContent();
		return actualLineContent.substring(0, this.firstCharOffset + offset);
	}

	public getCount(): number {
		return this._lastTokenIndex - this.firstTokenIndex;
	}

	public findTokenIndexAtOffset(offset: number): number {
		console.log('findTokenIndexAtOffset');
		console.log('offset', offset);
		console.log('this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset) : ', this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset));
		console.log('this.firstTokenIndex : ', this.firstTokenIndex);
		return this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset) - this.firstTokenIndex;
	}

	public getStandardTokenType(tokenIndex: number): StandardTokenType {
		return this._actual.getStandardTokenType(tokenIndex + this.firstTokenIndex);
	}

	public getStartOffset(tokenIndex: number): number {
		return this._actual.getStartOffset(tokenIndex + this.firstTokenIndex) - this.firstCharOffset;
	}

	public getEndOffset(tokenIndex: number): number {
		return this._actual.getEndOffset(tokenIndex + this.firstTokenIndex) - this.firstCharOffset;
	}
}

const enum IgnoreBracketsInTokens {
	value = StandardTokenType.Comment | StandardTokenType.String | StandardTokenType.RegEx
}

export function ignoreBracketsInToken(standardTokenType: StandardTokenType): boolean {
	return (standardTokenType & IgnoreBracketsInTokens.value) !== 0;
}
