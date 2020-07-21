import {Component, ViewChild, ElementRef, Renderer2, AfterViewInit} from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Date: 2020/07/20 
 * Name: Even 
 */
@Component({
  selector: 'paginator-configurable-example',
  templateUrl: 'paginator-configurable-example.html',
  styleUrls: ['paginator-configurable-example.css'],
})
export class PaginatorConfigurableExample implements AfterViewInit {
    @ViewChild('demoPages', {read: ElementRef}) demoPages: ElementRef;
    @ViewChild(MatPaginator, { static: true }) protected myPaginator: MatPaginator;

  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  private isShowBtnPages = true;
  private defaultMode = 1; // 0: Render all button, 1: Render the buttons you set.
  private gap = 2; // If the number is exceeded, the appropriate value will be calculated.
  private addedBtns: Array<any> = [];
   constructor(private ren: Renderer2) {}
  ngAfterViewInit(): void {
    this.demoInitBtnPages();
     let obs = merge(this.myPaginator.page).pipe(
       tap(_=> this.demoInitBtnPages())
       ).subscribe();
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
    private initBtnPages() {
    if (this.demoPages) {
      const hasShowCustomPageButtonsAttr = this.demoPages.nativeElement.attributes.showcustompagebuttons;
      const isShowBtnPages = this.demoPages.nativeElement.attributes.showcustompagebuttons.value === 'false' ? false : true;
      // showCustomPageBtns = true
      if (isShowBtnPages || hasShowCustomPageButtonsAttr === undefined) {
        const defaultMode = 1;
        const hasShowCustomModeAttr = this.demoPages.nativeElement.attributes.showcustommode;
        let showMode = this.demoPages.nativeElement.attributes.showcustommode.value === '1' ? 1 : 0;
        showMode = hasShowCustomModeAttr === undefined ? defaultMode : showMode;
        // default = 0, 0 Render all Btns, 1 Render the buttons you set.
        this.createBtnRange(this.defaultMode);
      }
    }
  }

  public searchPages(pageIndex: number) {
    if (this.myPaginator) {
      this.myPaginator.pageIndex = pageIndex;        this.demoInitBtnPages();
    }
  }

  private demoInitBtnPages(): void {
    if (this.demoPages) {
      if (this.isShowBtnPages) {
        this.createBtnRange(this.defaultMode);
      }
    }
  }

  private createBtnRange(isRenderMode: number) {
    let totalPage = this.length / this.myPaginator.pageSize;
    totalPage =  Math.floor(totalPage) < totalPage ? Math.floor(totalPage) + 1 : Math.floor(totalPage);

    const parentNode = this.demoPages.nativeElement.childNodes[0].childNodes[0].childNodes[2];
    const refNode =  this.demoPages.nativeElement.childNodes[0].childNodes[0].childNodes[2].childNodes[5];

    if (this.addedBtns.length > 0) {
      this.addedBtns.forEach(btn => {
        this.ren.removeChild(parentNode, btn);
      });
      this.addedBtns.length = 0;
    }
    if (isRenderMode === 0) {
      for (let i = 0; i < totalPage; i++) {
        this.createBtn(parentNode, refNode, i+1);
      }
    } else {
      // tslint:disable-next-line:prefer-const
      // let { start, end } = this.calculationGapBtn(totalPage);
      let start = this.myPaginator.pageIndex - this.gap < 1 ? 1 :  this.myPaginator.pageIndex - this.gap;
      const end = this.myPaginator.pageIndex + this.gap > totalPage ? totalPage : this.myPaginator.pageIndex + this.gap;
      for ( start; start <= end; start++) {
        this.createBtn(parentNode, refNode, start);
      }
    }
  }

  private createBtn(parentNode: any, refNode: any, i: number) {
    const linkBtn = this.ren.createElement('button');
    this.ren.setAttribute(linkBtn, 'type', 'button');
    this.ren.addClass(linkBtn, 'mat-button-base');
    this.ren.addClass(linkBtn, 'mat-focus-indicator');
    this.ren.addClass(linkBtn, 'mat-icon-button');

    const text = this.ren.createText(String(i));
    this.ren.appendChild(linkBtn, text);

    if (this.myPaginator.pageIndex === i - 1) {
      this.ren.setAttribute(linkBtn, 'disabled', 'disabled');
      this.ren.setStyle(linkBtn, 'background', '#4899d0');
      this.ren.setStyle(linkBtn, 'color', '#FFFFFF');
    } else {
      this.ren.listen(linkBtn, 'click', () => {
        this.searchPages(i-1);
      });
    }
    this.ren.insertBefore(parentNode, linkBtn, refNode);
    this.addedBtns.push(linkBtn);
  }
  private calculationGapBtn(totalPage: number) {
    const res = { start: 0, end: 0};
    const gap = this.gap;
    const start = this.myPaginator.pageIndex - (gap - 1);
    const end = this.myPaginator.pageIndex + (gap + 1);

    res.start = this.calculationStartNumber(start, gap);
    res.end = this.calculationEndNumber(end, totalPage, gap);

    return res;
  }

  private calculationStartNumber(start: number, gap: number) {
    if (start < 1) {
      start = start + 1;
      start = this.calculationStartNumber(start, gap);
    }
    return start;
  }

  private calculationEndNumber(end: number, totalPage: number, gap: number) {
    this.myPaginator.nextPage
    if (end > totalPage) {
      end = end - 1;
      end = this.calculationEndNumber(end, totalPage, gap);
    }
    return end;
  }
}


/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */