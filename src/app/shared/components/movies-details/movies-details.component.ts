import {
  Component,
  ElementRef,
  HostListener,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../toast/toast.service';
import { MovieService } from '../../../services/movie.service';
import { CommonService } from '../../../services/common.service';
@Component({
  selector: 'app-movies-details',
  imports: [NgbModule, DatePipe],
  templateUrl: './movies-details.component.html',
  styleUrl: './movies-details.component.scss',
})
export class MoviesDetailsComponent {
  showHeader = false;
  movieDetails: any;
  movieId: number = 0;

  constructor(
    private location: Location,
    private modalService: NgbModal,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    public commmonservice: CommonService
  ) {}
  ngOnInit() {
    const state = this.location.getState();
    // this.movieDetails = state;
    this.route.params.subscribe((params) => {
      this.movieId = +params['id'];
    });

    console.log(this.movieId);

    this.onGetMovieDetailsById();
  }

  @HostListener('window:scroll')
  onScroll() {
    const section = document.getElementsByClassName(
      'description_movie_section'
    );
    if (!section.length) return;
    this.showHeader = window.scrollY >= (section[0] as HTMLElement).offsetTop;
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, {
      modalDialogClass: 'book-ticekt-dialog',
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
    });
  }

  onGetMovieDetailsById() {
    this.movieService.getMovieDetailsById(this.movieId).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.movieDetails = res.data;
        }
      },
      error: (err) => {
        this.toastService.startToast(err.message || 'Something went wrong');
      },
    });
  }
}
